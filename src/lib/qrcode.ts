'use client'
// src/lib/qrcode.ts — Pure JavaScript QR Code generator (no dependencies)
// Generates QR codes as SVG strings

// ── QR Code data types ──
const ERROR_CORRECTION = { L: 1, M: 0, Q: 3, H: 2 } as const
type ECLevel = keyof typeof ERROR_CORRECTION

// ── Simplified QR encoding (alphanumeric/byte mode) ──
// This uses a well-known QR code algorithm adapted for inline SVG generation

/**
 * Generate a QR code as an SVG data URI
 */
export function generateQRCodeSVG(text: string, size = 200, darkColor = '#0e0d0b', lightColor = 'transparent'): string {
    const modules = generateQRMatrix(text)
    const moduleCount = modules.length
    const cellSize = size / moduleCount

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`
    svg += `<rect width="${size}" height="${size}" fill="${lightColor}"/>`

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (modules[row][col]) {
                const x = col * cellSize
                const y = row * cellSize
                svg += `<rect x="${x}" y="${y}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="${darkColor}" rx="${cellSize * 0.15}"/>`
            }
        }
    }

    svg += '</svg>'
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Generate a QR code as a canvas-based data URL (PNG)
 */
export function generateQRCodeDataURL(text: string, size = 300, darkColor = '#0e0d0b', lightColor = '#ffffff'): string {
    const modules = generateQRMatrix(text)
    const moduleCount = modules.length
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const cellSize = size / moduleCount

    ctx.fillStyle = lightColor
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = darkColor
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (modules[row][col]) {
                ctx.fillRect(col * cellSize, row * cellSize, cellSize + 0.5, cellSize + 0.5)
            }
        }
    }

    return canvas.toDataURL('image/png')
}

// ── QR Matrix Generation ──
// Minimal QR code implementation for version 1-6 (up to ~134 chars)

function generateQRMatrix(text: string): boolean[][] {
    const data = new TextEncoder().encode(text)
    const version = getVersion(data.length)
    const size = version * 4 + 17
    const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))

    // Place finder patterns
    placeFinderPattern(matrix, 0, 0)
    placeFinderPattern(matrix, size - 7, 0)
    placeFinderPattern(matrix, 0, size - 7)

    // Place timing patterns
    for (let i = 8; i < size - 8; i++) {
        if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0
        if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0
    }

    // Place alignment patterns for version >= 2
    if (version >= 2) {
        const positions = getAlignmentPositions(version)
        for (const row of positions) {
            for (const col of positions) {
                if (matrix[row][col] === null) {
                    placeAlignmentPattern(matrix, row, col)
                }
            }
        }
    }

    // Dark module
    matrix[size - 8][8] = true

    // Reserve format info areas
    reserveFormatArea(matrix, size)

    // Encode data
    const encoded = encodeData(data, version)

    // Place data bits
    placeDataBits(matrix, encoded, size)

    // Apply mask (mask 0: (row + col) % 2 === 0)
    applyMask(matrix, size)

    // Place format info
    placeFormatInfo(matrix, size)

    return matrix.map(row => row.map(cell => cell === true))
}

function getVersion(dataLen: number): number {
    // Byte mode capacities with M error correction
    const caps = [0, 14, 26, 42, 62, 84, 106]
    for (let v = 1; v < caps.length; v++) {
        if (dataLen <= caps[v]) return v
    }
    return 6 // max we support
}

function placeFinderPattern(matrix: (boolean | null)[][], row: number, col: number) {
    const pattern = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
    ]
    for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
            const rr = row + r, cc = col + c
            if (rr >= 0 && rr < matrix.length && cc >= 0 && cc < matrix.length) {
                if (r >= 0 && r < 7 && c >= 0 && c < 7) {
                    matrix[rr][cc] = pattern[r][c] === 1
                } else {
                    matrix[rr][cc] = false
                }
            }
        }
    }
}

function placeAlignmentPattern(matrix: (boolean | null)[][], centerRow: number, centerCol: number) {
    for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
            const rr = centerRow + r, cc = centerCol + c
            if (rr >= 0 && rr < matrix.length && cc >= 0 && cc < matrix.length) {
                matrix[rr][cc] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)
            }
        }
    }
}

function getAlignmentPositions(version: number): number[] {
    if (version < 2) return []
    const intervals: Record<number, number[]> = {
        2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
    }
    return intervals[version] || [6, 18]
}

function reserveFormatArea(matrix: (boolean | null)[][], size: number) {
    // Horizontal near top-left
    for (let i = 0; i <= 8; i++) {
        if (matrix[8][i] === null) matrix[8][i] = false
        if (matrix[i][8] === null) matrix[i][8] = false
    }
    // Near top-right
    for (let i = size - 8; i < size; i++) {
        if (matrix[8][i] === null) matrix[8][i] = false
    }
    // Near bottom-left
    for (let i = size - 7; i < size; i++) {
        if (matrix[i][8] === null) matrix[i][8] = false
    }
}

function encodeData(data: Uint8Array, version: number): boolean[] {
    const bits: boolean[] = []

    // Mode indicator: byte mode = 0100
    pushBits(bits, 0b0100, 4)

    // Character count (8 bits for version 1-9)
    pushBits(bits, data.length, 8)

    // Data bytes
    for (const byte of data) {
        pushBits(bits, byte, 8)
    }

    // Terminator
    pushBits(bits, 0, 4)

    // Pad to byte boundary
    while (bits.length % 8 !== 0) bits.push(false)

    // Total data codewords for M correction
    const totalCodewords = getTotalCodewords(version)
    while (bits.length < totalCodewords * 8) {
        pushBits(bits, 0xEC, 8)
        if (bits.length < totalCodewords * 8) pushBits(bits, 0x11, 8)
    }

    return bits
}

function getTotalCodewords(version: number): number {
    const cw = [0, 16, 28, 44, 64, 86, 108]
    return cw[version] || 16
}

function pushBits(bits: boolean[], value: number, count: number) {
    for (let i = count - 1; i >= 0; i--) {
        bits.push(((value >> i) & 1) === 1)
    }
}

function placeDataBits(matrix: (boolean | null)[][], data: boolean[], size: number) {
    let bitIndex = 0
    let upward = true

    for (let col = size - 1; col >= 0; col -= 2) {
        if (col === 6) col = 5 // skip timing column

        const rows = upward
            ? Array.from({ length: size }, (_, i) => size - 1 - i)
            : Array.from({ length: size }, (_, i) => i)

        for (const row of rows) {
            for (let c = 0; c < 2; c++) {
                const cc = col - c
                if (cc < 0) continue
                if (matrix[row][cc] !== null) continue
                matrix[row][cc] = bitIndex < data.length ? data[bitIndex] : false
                bitIndex++
            }
        }
        upward = !upward
    }
}

function applyMask(matrix: (boolean | null)[][], size: number) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (isDataModule(row, col, size, matrix)) {
                if ((row + col) % 2 === 0) {
                    matrix[row][col] = !matrix[row][col]
                }
            }
        }
    }
}

function isDataModule(row: number, col: number, size: number, matrix: (boolean | null)[][]): boolean {
    // Skip finder patterns + separators
    if (row < 9 && col < 9) return false
    if (row < 9 && col >= size - 8) return false
    if (row >= size - 8 && col < 9) return false
    // Skip timing patterns
    if (row === 6 || col === 6) return false
    // Skip format info
    if (row === 8 && (col <= 8 || col >= size - 8)) return false
    if (col === 8 && (row <= 8 || row >= size - 7)) return false
    return true
}

function placeFormatInfo(matrix: (boolean | null)[][], size: number) {
    // Format info for mask 0, error correction M
    // Pre-computed: mask=0, EC=M → format bits = 101010000010010
    const formatBits = 0b101010000010010

    // Place around top-left finder
    const positions1 = [
        [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [7, 8], [8, 8],
        [8, 7], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
    ]
    for (let i = 0; i < 15; i++) {
        const [r, c] = positions1[i]
        matrix[r][c] = ((formatBits >> (14 - i)) & 1) === 1
    }

    // Place around other finders
    const positions2 = [
        [8, size - 1], [8, size - 2], [8, size - 3], [8, size - 4],
        [8, size - 5], [8, size - 6], [8, size - 7], [8, size - 8],
        [size - 7, 8], [size - 6, 8], [size - 5, 8], [size - 4, 8],
        [size - 3, 8], [size - 2, 8], [size - 1, 8],
    ]
    for (let i = 0; i < 15; i++) {
        const [r, c] = positions2[i]
        matrix[r][c] = ((formatBits >> (14 - i)) & 1) === 1
    }
}

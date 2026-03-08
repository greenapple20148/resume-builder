'use client'
// src/lib/resumeVersions.ts — Resume Version History
// Auto-snapshots resume data on save. Pro+ users can browse and restore.

import { supabase } from './supabase'
import type { ResumeData } from '../types'

export interface ResumeVersion {
    id: string
    resume_id: string
    user_id: string
    data: ResumeData
    title: string | null
    theme_id: string | null
    version_number: number
    created_at: string
}

// ── Minimum interval between snapshots (5 minutes) ───────
// Prevents creating a version on every autosave keystroke
const MIN_SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000
const lastSnapshotTime = new Map<string, number>()

/**
 * Save a version snapshot of the resume.
 * Throttled to max once per 5 minutes per resume.
 * Called automatically after each successful save.
 */
export async function saveVersionSnapshot(
    resumeId: string,
    userId: string,
    data: ResumeData,
    title?: string,
    themeId?: string,
    force = false,
): Promise<void> {
    // Throttle: skip if we saved a version recently
    const lastTime = lastSnapshotTime.get(resumeId) || 0
    const now = Date.now()
    if (!force && now - lastTime < MIN_SNAPSHOT_INTERVAL_MS) {
        return
    }

    try {
        // Get the latest version number
        const { data: latest } = await supabase
            .from('resume_versions')
            .select('version_number')
            .eq('resume_id', resumeId)
            .order('version_number', { ascending: false })
            .limit(1)
            .single()

        const nextVersion = (latest?.version_number || 0) + 1

        const { error } = await supabase
            .from('resume_versions')
            .insert({
                resume_id: resumeId,
                user_id: userId,
                data,
                title: title || null,
                theme_id: themeId || null,
                version_number: nextVersion,
            })

        if (error) {
            console.error('[versions] Failed to save snapshot:', error)
        } else {
            lastSnapshotTime.set(resumeId, now)
        }
    } catch (err) {
        console.error('[versions] Snapshot error:', err)
    }
}

/**
 * Get version history for a resume (newest first, max 10).
 */
export async function getVersionHistory(resumeId: string): Promise<ResumeVersion[]> {
    const { data, error } = await supabase
        .from('resume_versions')
        .select('*')
        .eq('resume_id', resumeId)
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) {
        console.error('[versions] Failed to fetch history:', error)
        return []
    }

    return (data || []) as ResumeVersion[]
}

/**
 * Restore a specific version.
 * Saves the current state as a new version first ("pre-restore backup"),
 * then overwrites resume data with the selected version.
 */
export async function restoreVersion(
    resumeId: string,
    userId: string,
    version: ResumeVersion,
    currentData: ResumeData,
    currentTitle?: string,
    currentThemeId?: string,
): Promise<{ success: boolean }> {
    // Save current state as a backup before restoring
    await saveVersionSnapshot(resumeId, userId, currentData, currentTitle, currentThemeId, true)

    // Restore the selected version's data
    const updates: Record<string, any> = {
        data: version.data,
        last_edited_at: new Date().toISOString(),
    }
    if (version.theme_id) updates.theme_id = version.theme_id

    const { error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', resumeId)
        .eq('user_id', userId)

    if (error) {
        console.error('[versions] Failed to restore version:', error)
        return { success: false }
    }

    return { success: true }
}

/**
 * Delete a specific version.
 */
export async function deleteVersion(versionId: string): Promise<void> {
    const { error } = await supabase
        .from('resume_versions')
        .delete()
        .eq('id', versionId)

    if (error) {
        console.error('[versions] Failed to delete version:', error)
    }
}

/**
 * Get a human-readable label for when a version was saved.
 */
export function getVersionTimeLabel(createdAt: string): string {
    const date = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay < 7) return `${diffDay}d ago`

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

path = 'src/pages/ThemesPreviews2.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

theme_ids = {
    'CorporateSlatePreview': 'corporate_slate',
    'TealWavePreview': 'teal_wave',
    'PurpleDuskPreview': 'purple_dusk',
    'CoralBrightPreview': 'coral_bright',
    'OceanDeepPreview': 'ocean_deep',
    'SageProPreview': 'sage_pro',
    'CarbonNoirPreview': 'carbon_noir',
    'SandDunePreview': 'sand_dune',
    'IndigoSharpPreview': 'indigo_sharp',
    'PlatinumElitePreview': 'platinum_elite',
    'CascadeBluePreview': 'cascade_blue',
    'NordicMinimalPreview': 'nordic_minimal',
    'MidnightProPreview': 'midnight_pro',
    'BlueprintPreview': 'blueprint',
    'EmeraldFreshPreview': 'emerald_fresh',
    'SunsetWarmPreview': 'sunset_warm',
    'NewspaperClassicPreview': 'newspaper_classic',
    'IvoryMarblePreview': 'ivory_marble',
    'NeonCyberPreview': 'neon_cyber',
}

new_lines = []
for line in lines:
    found = False
    for comp_name, theme_id in theme_ids.items():
        target = f"export const {comp_name}: React.FC<PreviewProps> = () => " + "{\n"
        if line == target:
            new_lines.append(f"export const {comp_name}: React.FC<PreviewProps> = ({{ data }}) => {{\n")
            new_lines.append(f"    const res = useDynamicData(data || {{}}, '{theme_id}')\n")
            new_lines.append(f"    const nameParts = res.name.split(' ')\n")
            new_lines.append(f"    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]\n")
            new_lines.append(f"    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''\n")
            print(f"OK {comp_name}")
            found = True
            break
    if not found:
        new_lines.append(line)

with open(path, 'w') as f:
    f.writelines(new_lines)
print("Done")

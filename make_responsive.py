import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded widths with responsive classes
content = content.replace('w-[1360px]', 'w-full max-w-[1360px]')
content = content.replace('w-[1280px]', 'w-full max-w-[1280px]')

# Also there are some w-[826px], w-[808px] etc. Let's just make the main containers responsive.
# The absolute left-10 might push things out. Let's change absolute left-10 to px-10 relative
content = content.replace('w-[1280px] h-[317px] absolute left-10 top-10', 'w-full max-w-[1280px] h-auto relative p-10')
# The parent was: w-[1360px] h-[397px] overflow-hidden relative
content = content.replace('w-[1360px] h-[397px]', 'w-full max-w-[1360px] h-auto')

# Also the black background in the footer was:
# <div className="rounded-[14.3px] bg-[rgba(0,0,0,0.44)] w-[1360px] h-[397px] absolute left-0 top-px overflow-hidden"></div>
content = content.replace('bg-[rgba(0,0,0,0.44)] w-[1360px] h-[397px] absolute left-0 top-px', 'bg-[rgba(0,0,0,0.44)] w-full h-full absolute left-0 top-0')

# And the links area in footer:
content = content.replace('shrink-0 w-[317px]', 'shrink-0 w-full md:w-[317px]')

# Let's fix the other hardcoded absolute positioning on the main sections
# Many containers have w-full h-[1218px] etc. We should make them h-auto
content = re.sub(r'h-\[1218px\]', 'h-auto py-20', content)
content = re.sub(r'h-\[1201px\]', 'h-auto py-20', content)
content = re.sub(r'h-\[1038px\]', 'h-auto py-20', content)
content = re.sub(r'h-\[940px\]', 'h-auto py-20', content)
content = re.sub(r'h-\[732px\]', 'min-h-screen h-auto', content)
content = re.sub(r'h-\[938px\]', 'h-auto', content)
content = re.sub(r'h-\[921px\]', 'h-auto', content)
content = re.sub(r'h-\[758px\]', 'h-auto', content)
content = re.sub(r'h-\[660px\]', 'h-auto', content)

# General fixes for overflow-hidden on the main body
content = content.replace('min-w-screen min-h-screen relative', 'w-full min-h-screen relative overflow-x-hidden')
content = content.replace('overflow-hidden', 'overflow-hidden max-w-full')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Made layout more responsive.")

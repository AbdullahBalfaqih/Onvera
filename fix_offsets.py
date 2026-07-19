import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the footer wrapper
# It was: absolute left-[84px] top-20
# We want it centered with mx-auto
content = content.replace('absolute left-[84px] top-20', 'relative mx-auto mt-20')

# Fix the navbar wrapper at the bottom of the file
content = content.replace('absolute left-[84px] top-2.5', 'relative mx-auto mt-2.5 hidden') # Actually, we already have a Navbar in layout.tsx, so this Builder.io navbar is a duplicate! Let's hide it completely to avoid confusion, or just remove its absolute left
content = content.replace('absolute left-[84px]', 'relative mx-auto')

# There might be other absolute left-[xxx] that push content off screen.
# Let's fix the parent of the footer, which has h-[637px]
content = content.replace('shrink-0 w-full h-[637px] overflow-hidden max-w-full relative', 'shrink-0 w-full h-auto max-w-full relative py-10')

# Re-save
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed layout offsets.")

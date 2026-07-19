import re
import sys

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find blocks of absolutely positioned <p> tags
# We will match the parent div up to its closing tag
pattern = r'(<div className="[^"]*relative[^"]*">)\s*((?:<p className="[^"]*absolute[^"]*">[^<]+</p>\s*)+)(</div>)'

def replace_block(match):
    parent_div = match.group(1)
    inner_p = match.group(2)
    closing_div = match.group(3)
    
    # Extract all text from the inner <p> tags
    texts = re.findall(r'>\s*([^<]+)\s*</p>', inner_p)
    # clean up newlines and spaces
    clean_texts = [t.strip() for t in texts]
    combined_text = ' '.join(clean_texts)
    
    # We want to use the styling of the first <p> but remove 'absolute', 'left-...', 'top-...', 'w-...', 'h-...'
    # Find the first class string
    first_p_match = re.search(r'<p className="([^"]+)"', inner_p)
    if first_p_match:
        classes = first_p_match.group(1)
        # Remove absolute positioning and specific sizes
        classes = re.sub(r'\babsolute\b', 'relative', classes)
        classes = re.sub(r'\bleft-[^\s]+\b', '', classes)
        classes = re.sub(r'\btop-[^\s]+\b', '', classes)
        classes = re.sub(r'\b-top-[^\s]+\b', '', classes)
        classes = re.sub(r'\bw-[^\s]+\b', '', classes)
        classes = re.sub(r'\bh-[^\s]+\b', '', classes)
        # Clean up double spaces
        classes = re.sub(r'\s+', ' ', classes).strip()
        
        # also modify the parent div to not have fixed heights that might clip
        new_parent_div = re.sub(r'\bh-\[[^\]]+\]\b', 'h-auto', parent_div)
        
        return f'{new_parent_div}\n<p className="{classes}">{combined_text}</p>\n{closing_div}'
    return match.group(0)

new_content = re.sub(pattern, replace_block, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Replaced absolute text blocks with flowing text.")

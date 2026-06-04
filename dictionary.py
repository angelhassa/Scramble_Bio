import pdfplumber

pdf_path = ""

entries = {}
current_term = None
current_def = []

with pdfplumber.open(pdf_path) as pdf:

    for page in pdf.pages:

        lines = page.extract_text().split("\n")

        for line in lines:

            line = line.strip()

#skip header + extra words in the page           
            if (
                line == "Biology Dictionary"
                or line.startswith("RGUKT/")
                or len(line) == 1
            ):
                continue
# checking if definition or the word
            is_term = (
                len(line) < 40
                and line[0].isupper()
                and not line.endswith(".")
            )

            if is_term:

                if current_term:
                    entries[current_term] = " ".join(current_def)

                current_term = line
                current_def = []

            else:
                current_def.append(line)

if current_term:
    entries[current_term] = " ".join(current_def)
    
print(entries)
len(entries)
#%%
import json

with open("biology_dictionary.json", "w") as f:
    json.dump(entries, f, indent=2)

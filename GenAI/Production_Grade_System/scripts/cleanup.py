import shutil
from pathlib import Path

TARGETS = [
    Path("data/cache"),
]

for t in TARGETS:
    if t.exists():
        for p in t.iterdir():
            if p.is_file():
                p.unlink()
            else:
                shutil.rmtree(p, ignore_errors=True)

print("Cleanup done.")

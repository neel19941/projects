fname = input("Enter file name: ")
fh = open(fname)
for line in fh:
    line=line.rstrip()
    if not line.startswith("X-DSPAM-Confidence:"):
        continue
    print(line)
print("Done")

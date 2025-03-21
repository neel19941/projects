name = input("Enter file:")
if len(name) < 1:
    name = "mbox-short.txt"
handle = open(name)
hr=list()
counts= dict()
for line in handle:
    line = line.rstrip()
    if not line.startswith('From ') : continue
    words=line.split()
    hour=words[5].split(':')
    hr.append(hour[0])
for word in hr:
    counts[word] = counts.get(word,0) + 1
for k,v in sorted(counts.items()):
    print(k,v)


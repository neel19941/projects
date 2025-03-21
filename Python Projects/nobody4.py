name = input("Enter file:")
if len(name) < 1:
    name = "mbox-short.txt"
handle = open(name)
email=list()
counts = dict()
for line in handle:
    line = line.rstrip()
    if not line.startswith('From ') : continue
    words=line.split()
    email.append(words[1])
for word in email:
    counts[word] = counts.get(word,0) + 1
bigcount=None
bigword=None
for word,count in counts.items():
    if bigcount is None or count > bigcount:
        bigword = word
        bigcount = count
print(bigword,bigcount)
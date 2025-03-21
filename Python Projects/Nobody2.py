fname = input("Enter file name: ")
fh = open(fname)
nums=list()
for line in fh:
    line=line.rstrip()
    if not line.startswith("X-DSPAM-Confidence:"):
        continue
    nums.append(float(line[20:]))
total=0
for number in nums:
    total+=number
Avg = total / len(nums)
print('Average spam confidence:',Avg)
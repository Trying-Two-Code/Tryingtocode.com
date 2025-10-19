
    def main():
    	x = 1
y = 1
if x == 1 and y == 1:
 print('x and y are one')
else:
 print('x and y are not one')

    def correct(code, output):
    	awnsers = ['x and y are not one
']
    	include = ['']
    	found = {word: False for word in include}
    	for line in code.splitlines():
    		stripped = line.split('#')[0]
    		for word in include:
    			if word in stripped:
    				found[word] = True
    	if not all(found.values()):
    		return False
    	return output in awnsers
    
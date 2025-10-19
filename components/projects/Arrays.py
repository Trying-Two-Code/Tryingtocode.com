
    def main():
    	pets = ['cat', 'dog', 'snake']

for pet in pets:
 print(pet)

    def correct(code, output):
    	awnsers = ['*
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
    
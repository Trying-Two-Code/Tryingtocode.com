
    def main():
    	pets = ['cat', 'dog', 'snake']

print(pets[0])

    def correct(code, output):
    	awnsers = ['dog
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
    
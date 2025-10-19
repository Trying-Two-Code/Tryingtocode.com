import json

def insert_lesson(filename, index, new_lesson):
    # Load lessons from file
    with open(filename, "r") as f:
        lessons = json.load(f)

    # Convert dict to list ordered by key number
    ordered = [lessons["projects"][k] for k in sorted(lessons["projects"], key=lambda x: int(x))]

    # Insert the new lesson
    ordered.insert(index - 1, new_lesson)

    # Rebuild dict with renumbered keys
    renumbered = {str(i + 1): lesson for i, lesson in enumerate(ordered)}

    # Save back to file
    with open(filename, "w") as f:
        lessons["projects"] = renumbered
        json.dump(lessons, f, indent=4)

def delete_lesson(filename, index):
    # Load lessons from file
    with open(filename, "r") as f:
        lessons = json.load(f)

    # Convert dict to list ordered by key number
    ordered = [lessons["projects"][k] for k in sorted(lessons["projects"], key=lambda x: int(x))]

    ordered.pop(index - 1)

    renumbered = {str(i + 1): lesson for i, lesson in enumerate(ordered)}

    with open(filename, "w") as f:
        lessons["projects"] = renumbered
        json.dump(lessons, f, indent=4)




# new lesson to be made \/
new_lesson = {
    "title": "New Concept",
    "code": "print('new lesson')",
    "instruction": "Try this new step!",
    "returns": "the user should make it return this",
    "includes": "print"
}

def code_string(lesson=new_lesson):
    code_string = f"""
    def main():
    \t{lesson['code']}

    def correct(code, output):
    \tawnsers = ['{lesson["returns"]}']
    \tinclude = ['{lesson['includes']}']
    \tfound = {{word: False for word in include}}
    \tfor line in code.splitlines():
    \t\tstripped = line.split('#')[0]
    \t\tfor word in include:
    \t\t\tif word in stripped:
    \t\t\t\tfound[word] = True
    \tif not all(found.values()):
    \t\treturn False
    \treturn output in awnsers
    """
    return code_string


#create new lesson at index 1
#insert_lesson('python-projects.json', 1, new_lesson)

#delete lesson at index 1
#delete_lesson('python-projects.json', 1)

def write_file(write_lesson=new_lesson):
    python_file_name = f"./components/projects/{write_lesson['title']}.py"
    with open(python_file_name, "w") as new_python_file:
        new_python_file.write(code_string(write_lesson))

def convert_lesson(index, file_name="python-projects.json"):
    with(open(file_name, "r") as file):
        lessons = json.load(file)
    lesson = lessons["projects"][index]
    new_lesson = {
        "title": lesson.get("title"),
        "code": lesson.get("code"),
        "instruction": lesson.get("instruction"),
        "returns": lesson.get("returns", ""),
        "includes": lesson.get("includes", "")
    }
    return new_lesson

with open("python-projects.json", "r") as file:
    for key, lesson in json.load(file)["projects"].items():
        new_lesson = convert_lesson(key)
        print(new_lesson)
        write_file(new_lesson)
import json
import os

def insert_lesson(filename, index, new_lesson):
    # Load lessons from file
    with open(filename, "r") as f:
        lessons = json.load(f)

    # Convert dict to list ordered by key number
    ordered = [lessons["beginner-2"][k] for k in sorted(lessons["beginner-2"], key=lambda x: int(x))]

    # Insert the new lesson
    ordered.insert(index - 1, new_lesson)

    # Rebuild dict with renumbered keys
    renumbered = {str(i + 1): lesson for i, lesson in enumerate(ordered)}

    # Save back to file
    with open(filename, "w") as f:
        lessons["beginner-2"] = renumbered
        json.dump(lessons, f, indent=4)

def delete_lesson(filename, index):
    # Load lessons from file
    with open(filename, "r") as f:
        lessons = json.load(f)

    # Convert dict to list ordered by key number
    ordered = [lessons["beginner-2"][k] for k in sorted(lessons["beginner-2"], key=lambda x: int(x))]

    ordered.pop(index - 1)

    renumbered = {str(i + 1): lesson for i, lesson in enumerate(ordered)}

    with open(filename, "w") as f:
        lessons["projects"] = renumbered
        json.dump(lessons, f, indent=4)




# new lesson to be made \/
new_lesson = {
    "section": "beginner-2",
    "title": "Loop 1",
    "code": "for i in range(5):\n print('you ran the loop ' + i + ' times')\n\n",
    "instruction": "Run it 6 times",
    "output-includes": "you ran the loop 6 times&&&you ran the loop",
    "output-discludes": "*",
    "code-includes": "*",
    "code-discludes": "*",
    "failure-shows": "*"
}

insert_lesson('python-projects.json', 23, new_lesson)

def code_string(lesson=new_lesson):
    indent_lessons = [f" {les}" for les in lesson['code'].splitlines()]
    code_string = f"""
def main(run=False):
 code = {indent_lessons}
 if(run):
  exec_this = ""
  for line in code:
   exec_this += line
  exec(exec_this)
 pass

def correct(code, output):
 awnsers = ['''{lesson["returns"]}''']
 include = ['''{lesson['includes']}''']
 found = {{word: False for word in include}}
 for line in code.splitlines():
  stripped = line.split('#')[0]
  for word in include:
   if word in stripped:
    found[word] = True
 if not all(found.values()):
  return False
 return output in awnsers
    """
    return code_string


#create new lesson at index 1
#insert_lesson('python-projects.json', 1, new_lesson)


#delete lesson at index 1
#delete_lesson('python-projects.json', 1)

def write_file(write_lesson=new_lesson):
    python_folder = f"./components/projects/{write_lesson['section']}"
    python_file_name = f"{python_folder}/{write_lesson['title']}.py"
    if(not os.path.exists(python_folder)):
        os.mkdir(python_folder)
    with open(python_file_name, "w") as new_python_file:
        new_python_file.write(code_string(write_lesson))

def convert_lesson(index, file_name="python-projects.json"):
    with(open(file_name, "r") as file):
        lessons = json.load(file)
    lesson = lessons["beginner-2"][index]
    new_lesson = {
        "section": lesson.get("section", "python - unit 1"),
        "title": lesson.get("title", ""),
        "code": lesson.get("code", ""),
        "instruction": lesson.get("instruction", ""),
        "returns": lesson.get("returns", ""),
        "includes": lesson.get("includes", "")
    }
    return new_lesson

#with open("python-projects.json", "r") as file:
#    for key, lesson in json.load(file)["projects"].items():
#        new_lesson = convert_lesson(key)
#        print(new_lesson['section'])
#        write_file(new_lesson)
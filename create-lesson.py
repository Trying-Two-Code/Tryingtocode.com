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
    "returns": "the user should make it return this"
}

#create new lesson at index 1
#insert_lesson('python-projects.json', 1, new_lesson)

#delete lesson at index 1
#delete_lesson('python-projects.json', 1)

#python_file_name = f"./components/projects/{new_lesson['title']}.py"
#with open(python_file_name, "w") as new_python_file:
#    new_python_file.write(new_lesson["code"])
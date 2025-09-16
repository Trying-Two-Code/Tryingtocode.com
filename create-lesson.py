import json

def insert_lesson(filename, index, new_lesson):
    # Load lessons from file
    with open(filename, "r") as f:
        lessons = json.load(f)

    # Convert dict to list ordered by key number
    ordered = [lessons[str(i)] for i in range(1, len(lessons) + 1)]

    # Insert the new lesson
    ordered.insert(index - 1, new_lesson)

    # Rebuild dict with renumbered keys
    renumbered = {str(i + 1): lesson for i, lesson in enumerate(ordered)}

    # Save back to file
    with open(filename, "w") as f:
        json.dump(renumbered, f, indent=4)

# Example usage
new_lesson = {
    "title": "New Concept",
    "code": "print('new lesson')",
    "instruction": "Try this new step!"
}

insert_lesson('python-projects.json', 23, new_lesson)
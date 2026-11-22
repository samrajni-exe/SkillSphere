
USE skillsphere;

INSERT INTO lessons (course_id, title, content, lesson_order)
SELECT c.id, 'Introduction to Python',
'Python is a beginner-friendly programming language. It is used in AI, data science and web development.

Example:
print("Hello, World!")

The print() function displays output.',
1
FROM courses c
WHERE c.title = 'Python Programming'
AND NOT EXISTS (
    SELECT 1 FROM lessons l
    WHERE l.course_id = c.id AND l.lesson_order = 1
);

INSERT INTO lessons (course_id, title, content, lesson_order)
SELECT c.id, 'Variables and Data Types',
'Variables store information.

Example:
name = "Sam"
age = 20
height = 5.0
is_student = True

Common types:
str = Text
int = Whole numbers
float = Decimal numbers
bool = True or False

Use type() to check a variable type.',
2
FROM courses c
WHERE c.title = 'Python Programming'
AND NOT EXISTS (
    SELECT 1 FROM lessons l
    WHERE l.course_id = c.id AND l.lesson_order = 2
);

INSERT INTO lessons (course_id, title, content, lesson_order)
SELECT c.id, 'Taking User Input',
'The input() function accepts information from users.

Example:
name = input("Enter your name: ")
print("Welcome", name)

For numbers:
age = int(input("Enter your age: "))

Try creating a program that adds two user-entered numbers.',
3
FROM courses c
WHERE c.title = 'Python Programming'
AND NOT EXISTS (
    SELECT 1 FROM lessons l
    WHERE l.course_id = c.id AND l.lesson_order = 3
);

INSERT INTO lessons (course_id, title, content, lesson_order)
SELECT c.id, 'Operators in Python',
'Operators perform calculations and comparisons.

Arithmetic operators:
+ Addition
- Subtraction
* Multiplication
/ Division
// Floor division
% Modulus
** Exponentiation

Example:
a = 10
b = 3
print(a + b)
print(a % b)
print(a ** b)

Comparison operators:
== Equal
!= Not equal
> Greater than
< Less than',
4
FROM courses c
WHERE c.title = 'Python Programming'
AND NOT EXISTS (
    SELECT 1 FROM lessons l
    WHERE l.course_id = c.id AND l.lesson_order = 4
);

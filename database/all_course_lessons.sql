
USE skillsphere;

-- MACHINE LEARNING FUNDAMENTALS
INSERT INTO lessons (course_id,title,content,lesson_order)
SELECT c.id,v.title,v.content,v.lesson_order
FROM courses c
JOIN (
SELECT 'Introduction to Machine Learning' title,'Machine learning enables computers to learn patterns from data and make predictions. It is used in recommendation systems, image recognition and forecasting.' content,1 lesson_order
UNION ALL SELECT 'Types of Machine Learning','Supervised learning uses labelled data. Unsupervised learning finds patterns in unlabelled data. Reinforcement learning learns through rewards and feedback.',2
UNION ALL SELECT 'Data Preparation','Data preparation includes collecting data, removing duplicates, handling missing values and converting information into a suitable format for training.',3
UNION ALL SELECT 'Training Your First Model','A machine learning model learns patterns from training data. Split data into training and testing sets, train the model and evaluate its predictions.',4
) v
WHERE c.title='Machine Learning Fundamentals'
AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.lesson_order=v.lesson_order);

-- CYBERSECURITY ESSENTIALS
INSERT INTO lessons (course_id,title,content,lesson_order)
SELECT c.id,v.title,v.content,v.lesson_order
FROM courses c
JOIN (
SELECT 'Introduction to Cybersecurity' title,'Cybersecurity protects computers, networks, applications and information from unauthorized access and digital threats.' content,1 lesson_order
UNION ALL SELECT 'Common Cyber Threats','Learn about phishing, malware, ransomware, social engineering and data breaches. Understanding threats helps users recognize suspicious activity.',2
UNION ALL SELECT 'Passwords and Authentication','Use unique passwords, password managers and multi-factor authentication. Never share passwords or verification codes.',3
UNION ALL SELECT 'Safe Internet Practices','Check website addresses, use trusted networks, update software regularly and avoid suspicious attachments and links.',4
) v
WHERE c.title='Cybersecurity Essentials'
AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.lesson_order=v.lesson_order);

-- SQL AND DATABASE MANAGEMENT
INSERT INTO lessons (course_id,title,content,lesson_order)
SELECT c.id,v.title,v.content,v.lesson_order
FROM courses c
JOIN (
SELECT 'Introduction to Databases' title,'A database stores organized information. A relational database stores information in tables containing rows and columns.' content,1 lesson_order
UNION ALL SELECT 'SQL Basics','SQL is used to communicate with relational databases. Common commands include SELECT, INSERT, UPDATE and DELETE.',2
UNION ALL SELECT 'Keys and Relationships','A primary key uniquely identifies a row. A foreign key connects one table to another and helps maintain relationships between records.',3
UNION ALL SELECT 'Filtering and Joining Data','Use WHERE to filter records, ORDER BY to sort results and JOIN to retrieve related information from multiple tables.',4
) v
WHERE c.title='SQL and Database Management'
AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.lesson_order=v.lesson_order);

-- UI/UX DESIGN FUNDAMENTALS
INSERT INTO lessons (course_id,title,content,lesson_order)
SELECT c.id,v.title,v.content,v.lesson_order
FROM courses c
JOIN (
SELECT 'Introduction to UI and UX' title,'UI means User Interface and focuses on visual elements. UX means User Experience and focuses on how people interact with a product.' content,1 lesson_order
UNION ALL SELECT 'Design Principles','Learn visual hierarchy, contrast, alignment, consistency, spacing and typography to create clear and usable interfaces.',2
UNION ALL SELECT 'Wireframing and Prototyping','Wireframes are simple layouts that show structure. Prototypes simulate interactions and help teams test ideas before development.',3
UNION ALL SELECT 'User Research and Testing','User interviews, surveys and usability testing help designers understand user needs and improve product experiences.',4
) v
WHERE c.title='UI/UX Design Fundamentals'
AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.lesson_order=v.lesson_order);

-- DIGITAL MARKETING BASICS
INSERT INTO lessons (course_id,title,content,lesson_order)
SELECT c.id,v.title,v.content,v.lesson_order
FROM courses c
JOIN (
SELECT 'Introduction to Digital Marketing' title,'Digital marketing promotes products and services through online channels such as websites, search engines, email and social media.' content,1 lesson_order
UNION ALL SELECT 'Search Engine Optimization','SEO improves a website visibility in search results through useful content, relevant keywords and a well-structured website.',2
UNION ALL SELECT 'Social Media Marketing','Social media marketing uses platforms to share content, connect with audiences and build brand awareness. Plan content around your audience.',3
UNION ALL SELECT 'Marketing Analytics','Analytics measures website visits, engagement, conversions and campaign performance. Use data to understand what works and improve campaigns.',4
) v
WHERE c.title='Digital Marketing Basics'
AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.lesson_order=v.lesson_order);

-- ENTREPRENEURSHIP FUNDAMENTALS
INSERT INTO lessons (course_id,title,content,lesson_order)
SELECT c.id,v.title,v.content,v.lesson_order
FROM courses c
JOIN (
SELECT 'Introduction to Entrepreneurship' title,'Entrepreneurship is the process of identifying opportunities and creating solutions through products, services or businesses.' content,1 lesson_order
UNION ALL SELECT 'Identifying Business Opportunities','Observe problems people face, research customer needs and identify gaps in existing products or services.',2
UNION ALL SELECT 'Business Models and Planning','A business model explains how a business creates value and earns revenue. A business plan describes goals, customers, operations and finances.',3
UNION ALL SELECT 'Marketing and Growth','Businesses grow by understanding customers, delivering value, building trust and using feedback to improve their products and services.',4
) v
WHERE c.title='Entrepreneurship Fundamentals'
AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.lesson_order=v.lesson_order);

-- PROFESSIONAL COMMUNICATION
INSERT INTO lessons (course_id,title,content,lesson_order)
SELECT c.id,v.title,v.content,v.lesson_order
FROM courses c
JOIN (
SELECT 'Introduction to Professional Communication' title,'Professional communication means sharing information clearly and respectfully in workplaces, meetings, emails and presentations.' content,1 lesson_order
UNION ALL SELECT 'Written Communication','Professional writing should be clear, concise and organized. Use appropriate language, correct grammar and meaningful subject lines.',2
UNION ALL SELECT 'Verbal Communication and Listening','Speak clearly, organize your thoughts and listen actively. Ask relevant questions and respect different viewpoints.',3
UNION ALL SELECT 'Presentation and Interview Skills','Prepare your key points, structure your presentation, maintain appropriate eye contact and communicate your ideas confidently.',4
) v
WHERE c.title='Professional Communication'
AND NOT EXISTS (SELECT 1 FROM lessons l WHERE l.course_id=c.id AND l.lesson_order=v.lesson_order);

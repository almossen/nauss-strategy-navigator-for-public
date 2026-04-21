
-- Clear all existing data (order matters due to FK constraints)
DELETE FROM kpis;
DELETE FROM projects;
DELETE FROM initiatives;
DELETE FROM strategic_goals;
DELETE FROM pillars;
DELETE FROM university_info;

-- Re-insert university info
INSERT INTO university_info (mission_ar, mission_en, vision_ar, vision_en, values_ar, values_en)
VALUES (
  'تقديم تعليم أكاديمي متميز وبحث علمي رائد وتدريب احترافي في المجالات الأمنية',
  'Delivering distinguished academic education, pioneering research, and professional training in security fields',
  'أن تكون الجامعة مرجعية عربية رائدة في العلوم الأمنية',
  'To be a leading Arab reference in security sciences',
  'التميز، النزاهة، الشراكة، الابتكار',
  'Excellence, Integrity, Partnership, Innovation'
);

DO $$
DECLARE
  v_pillar_id uuid;
  v_goal1_id uuid;
  v_goal2_id uuid;
  v_goal3_id uuid;
  v_goal4_id uuid;
  v_init1_id uuid;
  v_init2_id uuid;
  v_init3_id uuid;
  v_init4_id uuid;
  v_init5_id uuid;
BEGIN
  -- === PILLAR ===
  v_pillar_id := gen_random_uuid();
  INSERT INTO pillars (id, name_ar, name_en, description_ar, description_en, general_goal_ar, general_goal_en, type, color, icon, sort_order)
  VALUES (v_pillar_id, 'العلاقات الخارجية', 'External Relations',
    'تعزيز حضور الجامعة إقليمياً ودولياً وبناء شراكات فعالة',
    'Enhancing the university presence regionally and internationally and building effective partnerships',
    'تعزيز مكانة الجامعة كمرجعية عربية رائدة في العلوم الأمنية',
    'Strengthen the university position as a leading Arab reference in security sciences',
    'pillar', '#3b6b8a', 'globe', 1);

  -- === STRATEGIC GOALS ===
  v_goal1_id := gen_random_uuid();
  INSERT INTO strategic_goals (id, pillar_id, name_ar, name_en, sort_order)
  VALUES (v_goal1_id, v_pillar_id, 'تعزيز الإعلام والاتصال المؤسسي', 'Strengthening Media and Institutional Communication', 1);

  v_goal2_id := gen_random_uuid();
  INSERT INTO strategic_goals (id, pillar_id, name_ar, name_en, sort_order)
  VALUES (v_goal2_id, v_pillar_id, 'تعزيز وتفعيل حضور الجامعة إقليمياً ودولياً', 'Enhancing the University Regional and International Presence', 2);

  v_goal3_id := gen_random_uuid();
  INSERT INTO strategic_goals (id, pillar_id, name_ar, name_en, sort_order)
  VALUES (v_goal3_id, v_pillar_id, 'شراكات دولية مستدامة وفعالة لخدمة ركائز الجامعة', 'Sustainable and Effective International Partnerships to Serve the University Pillars', 3);

  v_goal4_id := gen_random_uuid();
  INSERT INTO strategic_goals (id, pillar_id, name_ar, name_en, sort_order)
  VALUES (v_goal4_id, v_pillar_id, 'نشر المعرفة الأمنية وإدماج مبدأ خدمة المجتمع العربي في أعمال الجامعة', 'Disseminating Security Knowledge and Integrating Community Service into University Operations', 4);

  -- === INITIATIVES ===
  v_init1_id := gen_random_uuid();
  INSERT INTO initiatives (id, pillar_id, goal_id, name_ar, name_en, description_ar, description_en, sort_order)
  VALUES (v_init1_id, v_pillar_id, v_goal1_id,
    'بناء استراتيجية تسويق فعالة', 'Building an Effective Marketing Strategy',
    'إعداد خطة استراتيجية اتصالية تسويقية للجامعة', 'Preparing a strategic communication and marketing plan for the university', 1);

  v_init2_id := gen_random_uuid();
  INSERT INTO initiatives (id, pillar_id, goal_id, name_ar, name_en, description_ar, description_en, sort_order)
  VALUES (v_init2_id, v_pillar_id, v_goal1_id,
    'تعزيز التواصل الداخلي وتطوير البيئة الاجتماعية في الجامعة', 'Enhancing Internal Communication and Developing the Social Environment',
    'تطوير التواصل الداخلي والخدمات الاجتماعية والرياضية والإسكان', 'Developing internal communication, social, sports services and housing', 2);

  v_init3_id := gen_random_uuid();
  INSERT INTO initiatives (id, pillar_id, goal_id, name_ar, name_en, description_ar, description_en, sort_order)
  VALUES (v_init3_id, v_pillar_id, v_goal2_id,
    'تنظيم فعاليات ذات أثر', 'Organizing Impactful Events',
    'تنظيم فعاليات ومؤتمرات إقليمية ودولية ذات أثر', 'Organizing impactful regional and international events and conferences', 3);

  v_init4_id := gen_random_uuid();
  INSERT INTO initiatives (id, pillar_id, goal_id, name_ar, name_en, description_ar, description_en, sort_order)
  VALUES (v_init4_id, v_pillar_id, v_goal3_id,
    'العمل على تطوير شراكات إستراتيجية مع الجهات ذات العلاقة', 'Developing Strategic Partnerships with Relevant Entities',
    'تفعيل الشراكات والتعاون الدولي مع المنظمات والسفارات', 'Activating partnerships and international cooperation with organizations and embassies', 4);

  v_init5_id := gen_random_uuid();
  INSERT INTO initiatives (id, pillar_id, goal_id, name_ar, name_en, description_ar, description_en, sort_order)
  VALUES (v_init5_id, v_pillar_id, v_goal4_id,
    'وضع خطة شاملة للخدمة المجتمعية وإشراك منسوبي الجامعة بما فيهم الطلبة', 'Comprehensive Community Service Plan with Staff and Student Engagement',
    'إعداد وتنفيذ خطط المبادرات المجتمعية بمشاركة المنسوبين والطلبة', 'Preparing and implementing community initiative plans with staff and student participation', 5);

  -- === KPIs ===
  -- Initiative 1: بناء استراتيجية تسويق فعالة
  INSERT INTO kpis (initiative_id, name_ar, name_en, description_ar, description_en, unit, baseline, target_2025, target_2026, target_2027, target_2028, target_2029, final_target, calculation_method_ar, calculation_method_en, data_source_ar, data_source_en, supporting_references_ar, supporting_references_en, measurement_frequency, sort_order)
  VALUES
  (v_init1_id, 'اعتماد الخطة الاستراتيجية الاتصالية التسويقية للجامعة', 'Adoption of the university strategic communication and marketing plan',
   'يقيس مدى اعتماد الخطة الاستراتيجية الاتصالية التسويقية التي تعكس هوية الجامعة ورسالتها', 'Measures whether the university strategic communication and marketing plan has been formally adopted',
   'نسبة', '-', '-', '100%', '-', '-', '-', '100%',
   'مؤشر ثنائي: 1 = تم اعتماد الخطة، 0 = لم يتم اعتمادها', 'Binary indicator: 1 = Plan adopted, 0 = Not adopted',
   'وثائق اعتماد الخطة الصادرة عن الإدارة العليا للجامعة', 'Plan approval documents issued by the university senior management',
   'نسخة معتمدة من الخطة الاستراتيجية الاتصالية التسويقية للجامعة', 'Approved copy of the university strategic communication and marketing plan',
   'سنوي', 1);

  -- Initiative 2: تعزيز التواصل الداخلي
  INSERT INTO kpis (initiative_id, name_ar, name_en, description_ar, description_en, unit, baseline, target_2025, target_2026, target_2027, target_2028, target_2029, final_target, calculation_method_ar, calculation_method_en, data_source_ar, data_source_en, supporting_references_ar, supporting_references_en, measurement_frequency, sort_order)
  VALUES
  (v_init2_id, 'تنفيذ برنامج عمل الجامعة السنوي للأنشطة الاجتماعية والرياضية', 'Implementation of the university annual work program for social and sports activities',
   'يوضح نسبة ما تم تنفيذه فعلياً من الروزنامة السنوية للمناسبات والأنشطة', 'Reflects the percentage of the annual calendar of social and sports activities actually implemented',
   'نسبة', '-', '-', '80%', '80%', '85%', '90%', '90%',
   '(عدد الأنشطة المنفذة ÷ إجمالي الأنشطة المدرجة في الروزنامة) × 100', '(Number of activities implemented / Total activities listed in the calendar) x 100',
   'خطة الروزنامة السنوية وتقارير المتابعة من إدارة الفعاليات', 'Annual calendar plan and follow-up reports from the events management department',
   'نسخة من تقرير متابعة تنفيذ الروزنامة السنوية', 'Copy of the annual calendar implementation follow-up report',
   'سنوي', 2),

  (v_init2_id, 'نسبة رضا منسوبي الجامعة عن الخدمات الغذائية', 'University staff satisfaction rate with food services',
   'يقيس مستوى رضا منسوبي الجامعة عن جودة الخدمات الغذائية المقدمة', 'Measures the satisfaction level of university staff with the quality of food services',
   'نسبة', '-', '-', '80%', '80%', '90%', '95%', '95%',
   '(إجمالي درجات رضا المنسوبين عن الخدمات الغذائية ÷ عدد المستجيبين) × 100', '(Total staff satisfaction scores for food services / Number of respondents) x 100',
   'استبيانات رضا منسوبي الجامعة وتقارير قسم الضيافة', 'Staff satisfaction surveys and hospitality department reports',
   'نسخة من تقرير استبيان رضا منسوبي الجامعة عن الخدمات الغذائية', 'Copy of the staff satisfaction survey report on food services',
   'سنوي', 3),

  (v_init2_id, 'نسبة رضا منسوبي الجامعة عن الأنشطة الاجتماعية', 'University staff satisfaction rate with social activities',
   'يقيس مستوى رضا منسوبي الجامعة عن جودة وتنوع الأنشطة الاجتماعية', 'Measures the satisfaction level of university staff regarding social activities quality',
   'نسبة', '-', '-', '75%', '75%', '80%', '80%', '80%',
   '(إجمالي درجات رضا المنسوبين عن الأنشطة الاجتماعية ÷ عدد المستجيبين) × 100', '(Total staff satisfaction scores for social activities / Number of respondents) x 100',
   'استبيانات رضا منسوبي الجامعة وتقارير إدارة الفعاليات', 'Staff satisfaction surveys and events management department reports',
   'نسخة من تقرير استبيان رضا منسوبي الجامعة عن الأنشطة الاجتماعية', 'Copy of the staff satisfaction survey report on social activities',
   'سنوي', 4),

  (v_init2_id, 'نسبة رضا منسوبي الجامعة عن الخدمات الرياضية', 'University staff satisfaction rate with sports services',
   'يقيس مستوى رضا منسوبي الجامعة عن جودة خدمات المرافق الرياضية', 'Measures the satisfaction level of university staff with sports facility services',
   'نسبة', '-', '-', '75%', '75%', '80%', '80%', '80%',
   '(إجمالي درجات رضا منسوبي الجامعة عن المرافق الرياضية ÷ عدد المستجيبين) × 100', '(Total staff satisfaction scores for sports facilities / Number of respondents) x 100',
   'استبيانات رضا منسوبي الجامعة وتقارير المرافق الرياضية', 'Staff satisfaction surveys and sports facilities reports',
   'نسخة من تقرير استبيان رضا منسوبي الجامعة عن المرافق الرياضية', 'Copy of the staff satisfaction survey report on sports facilities',
   'سنوي', 5),

  (v_init2_id, 'نسبة رضا منسوبي الجامعة عن الإسكان', 'University staff satisfaction rate with housing',
   'يقيس مستوى رضا منسوبي الجامعة عن جودة خدمات الإسكان الداخلي', 'Measures the satisfaction level of university staff with internal housing services',
   'نسبة', '-', '-', '75%', '75%', '80%', '80%', '80%',
   '(إجمالي درجات رضا المنسوبين عن خدمات الإسكان ÷ عدد المستجيبين) × 100', '(Total staff satisfaction scores for housing services / Number of respondents) x 100',
   'استبيانات رضا منسوبي الجامعة عن خدمات الإسكان', 'Staff satisfaction surveys on housing services',
   'تقرير استبيان رضا المنسوبين عن تجربة السكن بالجامعة', 'Staff satisfaction survey report on the housing experience',
   'سنوي', 6),

  (v_init2_id, 'نسبة تحقيق متطلبات اعتماد جودة الخدمات الغذائية بالجامعة', 'Percentage of achieving food services quality accreditation requirements',
   'يقيس مدى التزام مطبخ الضيافة بمعايير الجودة والسلامة الغذائية', 'Measures the extent to which the hospitality kitchen complies with food quality and safety standards',
   'نسبة', '-', '-', '-', '50%', '100%', '-', '100%',
   'نسبة تحقيق متطلبات الجودة المطلوبة وفق تقرير تقييم الجودة', 'Percentage of required quality criteria achieved as per the quality assessment report',
   'تقرير تقييم الجودة الصادر من الجهة المختصة', 'Quality assessment report issued by the competent authority',
   'شهادة الاعتماد / تقرير زيارات الاعتماد / تقرير المطابقة', 'Accreditation certificate / Accreditation visit report / Compliance report',
   'سنوي', 7),

  (v_init2_id, 'نسبة تحقيق متطلبات اعتماد جودة خدمات الاسكان بالجامعة', 'Percentage of achieving housing services quality accreditation requirements',
   'يقيس مدى استيفاء خدمات الإسكان الداخلي لمتطلبات الاعتماد والجودة', 'Measures the extent to which internal housing services meet accreditation and quality requirements',
   'نسبة', '-', '-', '-', '50%', '100%', '-', '100%',
   'نسبة تحقيق متطلبات الجودة المطلوبة وفق تقرير تقييم جودة الإسكان', 'Percentage of required quality criteria achieved as per the housing quality assessment report',
   'تقرير تقييم جودة خدمات الإسكان من الجهة المختصة', 'Housing services quality assessment report from the competent authority',
   'شهادة الاعتماد / تقرير زيارات الاعتماد لخدمات الإسكان', 'Accreditation certificate / Housing services accreditation visit report',
   'سنوي', 8);

  -- Initiative 3: تنظيم فعاليات ذات أثر
  INSERT INTO kpis (initiative_id, name_ar, name_en, description_ar, description_en, unit, baseline, target_2025, target_2026, target_2027, target_2028, target_2029, final_target, calculation_method_ar, calculation_method_en, data_source_ar, data_source_en, supporting_references_ar, supporting_references_en, measurement_frequency, sort_order)
  VALUES
  (v_init3_id, 'نسبة الزيادة في عدد الدول العربية التي تجاوز تمثيلها الحد الأدنى المستهدف من المشاركين', 'Percentage increase in Arab countries exceeding minimum target representation',
   'يقيس نسبة الزيادة في أعداد المشاركين من الدول العربية', 'Measures the percentage increase in participants from Arab countries',
   'نسبة', '-', '63%', '72%', '81%', '90%', '100%', '100%',
   '((عدد الدول التي تجاوز تمثيلها في العام الحالي – العام السابق) ÷ عدد الدول في العام السابق) × 100', '((Countries exceeding minimum current year - Previous year) / Previous year count) x 100',
   'تقارير الفعاليات السنوية التي توضح أعداد المشاركين من الدول العربية', 'Annual event reports showing participant numbers from Arab countries',
   'تقرير مقارنة يوضح أعداد المشاركين من الدول العربية بين عامين متتاليين', 'Comparative report showing Arab country participant numbers across two consecutive years',
   'سنوي', 9),

  (v_init3_id, 'نسبة رضا المشاركين في الفعاليات (الأنشطة العلمية)', 'Participants satisfaction rate in events (scientific activities)',
   'يوضح مستوى رضا المشاركين عن جودة الفعاليات والأنشطة العلمية', 'Reflects the satisfaction level regarding the quality of scientific events',
   'نسبة', '80%', '80%', '83%', '85%', '88%', '90%', '90%',
   '(إجمالي درجات رضا المشاركين ÷ عدد المستجيبين) × 100', '(Total participant satisfaction scores / Number of respondents) x 100',
   'استبيانات رضا المشاركين وتقارير تقييم الفعاليات', 'Participant satisfaction surveys and event evaluation reports',
   'نسخة من تقرير استبيان رضا المشاركين في الفعاليات', 'Copy of the participant satisfaction survey report for events',
   'سنوي', 10),

  (v_init3_id, 'عدد الدول العربية المستضيفة لأنشطة الجامعة', 'Number of Arab countries hosting university activities',
   'يقيس عدد الدول العربية التي تُقام فيها أنشطة الجامعة', 'Measures the number of Arab countries in which university activities are held',
   'عدد', '6', '8', '9', '10', '11', '12', '12',
   'مجموع أماكن انعقاد الأنشطة في الدول العربية خلال العام', 'Total number of venues for activities held in Arab countries during the year',
   'سجلات تنظيم الأنشطة في الدول العربية وتقارير التنفيذ', 'Records of activity organization in Arab countries and implementation reports',
   'خطاب أو تقرير رسمي يوضح أماكن انعقاد الأنشطة في الدول العربية', 'Official letter or report showing activity venues in Arab countries',
   'سنوي', 11),

  (v_init3_id, 'تنفيذ المنتدى الدولي الأمني', 'Implementation of the International Security Forum',
   'يقيس مستوى التقدم المحقق في تنفيذ المنتدى الدولي الأمني', 'Measures the level of progress achieved in implementing the International Security Forum',
   'نسبة', '-', '-', '50%', '75%', '100%', '-', '100%',
   'نسبة الإنجاز المحققة من خطة المنتدى الدولي الأمني ÷ 100', 'Percentage of achievement from the International Security Forum plan / 100',
   'تقارير متابعة خطة المنتدى الدولي الأمني', 'Follow-up reports on the International Security Forum plan',
   'تقرير مرحلي معتمد يوضح نسبة إنجاز خطة المنتدى الدولي الأمني', 'Approved interim report showing the completion percentage',
   'سنوي', 12),

  (v_init3_id, 'عدد النسخ الإقليمية من المؤتمرات الدولية المستضافة في الجامعة', 'Number of regional editions of international conferences hosted at the university',
   'يوضح عدد الفعاليات التي تُنظَّم بنسخ إقليمية في الجامعة سنوياً', 'Reflects the number of events organized in regional editions at the university annually',
   'عدد', '1', '1', '2', '2', '-', '-', '5',
   'مجموع الفعاليات المنفذة بنسخ إقليمية خلال العام', 'Total number of events implemented in regional editions during the year',
   'تقارير الفعاليات السنوية التي تتضمن النسخ الإقليمية', 'Annual event reports that include regional editions',
   'تقرير رسمي يوثق تنفيذ الفعاليات بنسخ إقليمية', 'Official report documenting the implementation of events in regional editions',
   'سنوي', 13);

  -- Initiative 4: العمل على تطوير شراكات
  INSERT INTO kpis (initiative_id, name_ar, name_en, description_ar, description_en, unit, baseline, target_2025, target_2026, target_2027, target_2028, target_2029, final_target, calculation_method_ar, calculation_method_en, data_source_ar, data_source_en, supporting_references_ar, supporting_references_en, measurement_frequency, sort_order)
  VALUES
  (v_init4_id, 'عدد الشركاء المفعّلين لدعم ركائز الجامعة', 'Number of activated partners to support the university pillars',
   'يوضح نسبة الزيادة في عدد الشركاء المفعّلين', 'Reflects the percentage increase in activated partners',
   'نسبة', '35%', '40%', '45%', '50%', '55%', '60%', '60%',
   '(عدد الشركاء المفعّلين في العام الحالي ÷ إجمالي عدد شركاء الجامعة) × 100', '(Number of activated partners in current year / Total number of university partners) x 100',
   'تقارير متابعة تفعيل الشراكات من إدارة التعاون الدولي', 'Partnership activation follow-up reports from the International Cooperation Department',
   'تقرير شامل لتفعيل الشراكات مع الجهات المختلفة بالجامعة', 'Comprehensive report of partnership activation with various entities',
   'سنوي', 14),

  (v_init4_id, 'عدد الأمانات ومكاتب المستضافة مع المنظمات الدولية والأممية والإقليمية', 'Number of secretariats and offices hosted with international and regional organizations',
   'يقيس عدد الأمانات العامة ومكاتب التنسيق العلمي التي تستضيفها الجامعة', 'Measures the number of general secretariats and scientific coordination offices hosted',
   'عدد', '-', '1', '-', '1', '-', '1', '3',
   'مجموع الأمانات ومكاتب التنسيق الموقعة والمفعّلة', 'Total secretariats and coordination offices signed and activated',
   'سجلات إدارة الشراكات والتعاون الدولي', 'Partnership and International Cooperation Department records',
   'اتفاقيات استضافة الأمانات / وثائق إنشاء مكاتب التنسيق', 'Secretariat hosting agreements / Coordination office establishment documents',
   'سنوي', 15),

  (v_init4_id, 'عدد الأنشطة التفاعلية مع السفارات العربية والأجنبية', 'Number of interactive activities with Arab and foreign embassies',
   'يقيس عدد الزيارات والاجتماعات والأنشطة التفاعلية المنفذة مع السفارات', 'Measures the number of visits, meetings, and interactive activities with embassies',
   'عدد', '-', '20', '22', '24', '26', '28', '28',
   'مجموع الزيارات والاجتماعات والأنشطة التفاعلية المنفذة مع السفارات خلال العام', 'Total visits, meetings, and interactive activities with embassies during the year',
   'سجلات الاجتماعات والزيارات من وكالة الجامعة للعلاقات الخارجية', 'Meeting and visit records from the External Relations Agency',
   'محضر اجتماع أو خطاب رسمي يثبت تنفيذ الأنشطة التفاعلية مع السفارات', 'Meeting minutes or official letter proving implementation of interactive activities',
   'سنوي', 16),

  (v_init4_id, 'عدد المشاركين إلى الدول العربية في الأنشطة العلمية', 'Number of participants sent to Arab countries in scientific activities',
   'يوضح عدد المشاركين الذين يتوجهون إلى الدول العربية ضمن الأنشطة العلمية', 'Reflects the number of participants directed to Arab countries in scientific activities',
   'نسبة', '50%', '55%', '60%', '65%', '70%', '75%', '75%',
   'مجموع المشاركين في الأنشطة العلمية المنفذة في الدول العربية', 'Total participants in scientific activities in Arab countries',
   'تقارير برنامج عمل الجامعة السنوي وسجلات المشاركات العربية', 'University annual work program reports and Arab participation records',
   'تقرير رسمي يوضح الدول العربية المشاركة وأعداد المشاركين', 'Official report showing Arab countries and participant counts',
   'سنوي', 17),

  (v_init4_id, 'الإشادة السنوية من مجلس وزراء الداخلية العرب لبرنامج عمل الجامعة السنوي', 'Annual commendation from the Council of Arab Ministers of Interior',
   'يقيس مستوى الإشادة السنوية الرسمية الواردة من مجلس وزراء الداخلية العرب', 'Measures the level of annual official commendation received',
   'نسبة', '100%', '100%', '100%', '100%', '100%', '100%', '100%',
   'مؤشر ثنائي: 1 = في حال ورود إشادة رسمية، 0 = في حال عدم ورودها', 'Binary indicator: 1 = Official commendation received, 0 = Not received',
   'خطاب رسمي أو تقرير إشادة من مجلس وزراء الداخلية العرب', 'Official letter or commendation report from the Council',
   'خطاب إشادة رسمي من مجلس وزراء الداخلية العرب', 'Official commendation letter from the Council of Arab Ministers of Interior',
   'سنوي', 18),

  (v_init4_id, 'عدد الاجتماعات العربية المشاركة فيها الجامعة سنوياً', 'Number of Arab meetings in which the university participates annually',
   'يوضح عدد الاجتماعات العربية الرسمية التي تشارك فيها الجامعة', 'Reflects the number of official Arab meetings in which the university participates',
   'عدد', '10', '12', '13', '14', '15', '16', '16',
   'مجموع الاجتماعات العربية التي شاركت فيها الجامعة خلال العام', 'Total number of Arab meetings in which the university participated during the year',
   'محاضر الاجتماعات وتقارير المشاركة في الاجتماعات العربية', 'Meeting minutes and participation reports for Arab meetings',
   'تقرير شامل عن جميع مشاركات الجامعة في الاجتماعات العربية', 'Comprehensive report on all university participations in Arab meetings',
   'سنوي', 19);

  -- Initiative 5: وضع خطة شاملة للخدمة المجتمعية
  INSERT INTO kpis (initiative_id, name_ar, name_en, description_ar, description_en, unit, baseline, target_2025, target_2026, target_2027, target_2028, target_2029, final_target, calculation_method_ar, calculation_method_en, data_source_ar, data_source_en, supporting_references_ar, supporting_references_en, measurement_frequency, sort_order)
  VALUES
  (v_init5_id, 'تنفيذ الخطط السنوية للمبادرات المجتمعية', 'Implementation of annual plans for community initiatives',
   'يقيس مدى اعتماد وتنفيذ الخطط السنوية للمبادرات المجتمعية', 'Measures the extent to which annual community initiative plans have been implemented',
   'نسبة', '-', '-', '80%', '80%', '85%', '90%', '90%',
   '(عدد المبادرات المجتمعية المنفذة ÷ إجمالي المبادرات المعتمدة في الخطة) × 100', '(Number of community initiatives implemented / Total initiatives approved) x 100',
   'خطة المبادرات المجتمعية وتقارير التنفيذ السنوية', 'Community initiatives plan and annual implementation reports',
   'نسخة من خطة المبادرات المجتمعية وتقرير إنجازها', 'Copy of the community initiatives plan and achievement report',
   'سنوي', 20),

  (v_init5_id, 'نسبة المشاركين من منسوبي الجامعة في المبادرات المجتمعية', 'Percentage of university staff participating in community initiatives',
   'يوضح نسبة مشاركة منسوبي الجامعة في المبادرات المجتمعية', 'Reflects the participation rate of university staff in community initiatives',
   'نسبة', '-', '25%', '30%', '40%', '50%', '60%', '60%',
   '(عدد منسوبي الجامعة المشاركين ÷ إجمالي منسوبي الجامعة) × 100', '(Number of participating staff / Total university staff) x 100',
   'سجلات مشاركة منسوبي الجامعة في المبادرات المجتمعية', 'University staff participation records in community initiatives',
   'كشف رسمي يوضح أسماء منسوبي الجامعة المشاركين في المبادرات', 'Official list showing participating staff names',
   'سنوي', 21),

  (v_init5_id, 'نسبة المشاركين من طلبة الجامعة في المبادرات المجتمعية', 'Percentage of university students participating in community initiatives',
   'يقيس نسبة مشاركة طلبة الجامعة في المبادرات المجتمعية', 'Measures the participation rate of university students in community initiatives',
   'نسبة', '-', '25%', '30%', '40%', '50%', '60%', '60%',
   '(عدد طلبة الجامعة المشاركين ÷ إجمالي طلبة الجامعة) × 100', '(Number of participating students / Total university students) x 100',
   'سجلات مشاركة طلبة الجامعة في المبادرات المجتمعية', 'University student participation records in community initiatives',
   'كشف رسمي يوضح أسماء طلبة الجامعة المشاركين في المبادرات', 'Official list showing participating student names',
   'سنوي', 22),

  (v_init5_id, 'زيادة نسبة مشاركة الخريجين في برنامج الجامعة للخريجين', 'Increase in alumni participation in the university alumni program',
   'يوضح نسبة الزيادة السنوية في عدد المسجلين بمنصة رابطة الخريجين', 'Reflects the annual percentage increase in alumni platform registered members',
   'نسبة', '-', '-', '30%', '40%', '50%', '60%', '60%',
   '((عدد المسجلين الحالي – عدد المسجلين السابق) ÷ عدد المسجلين السابق) × 100', '((Current registered - Previous registered) / Previous registered) x 100',
   'سجلات منصة رابطة الخريجين وتقارير النمو السنوي', 'Alumni platform records and annual growth reports',
   'تقرير رسمي من منصة رابطة الخريجين يوضح عدد المسجلين ونسبة النمو', 'Official report from the alumni platform showing registered members and growth rate',
   'سنوي', 23),

  (v_init5_id, 'نسبة رضا المستفيدين من خدمات الجامعة المجتمعية', 'Satisfaction rate of beneficiaries of university community services',
   'يقيس مستوى رضا المستفيدين عن الخدمات المجتمعية التي تقدمها الجامعة', 'Measures the satisfaction level of beneficiaries regarding community services',
   'نسبة', '-', '65%', '70%', '80%', '85%', '90%', '90%',
   '(إجمالي درجات رضا المستفيدين ÷ عدد المستجيبين) × 100', '(Total beneficiary satisfaction scores / Number of respondents) x 100',
   'استبيانات رضا المستفيدين عن الخدمات المجتمعية', 'Beneficiary satisfaction surveys on community services',
   'نسخة من تقرير استبيان رضا المستفيدين عن الخدمات المجتمعية', 'Copy of beneficiary satisfaction survey report on community services',
   'سنوي', 24);

  -- === PROJECTS ===
  -- Initiative 1: بناء استراتيجية تسويق فعالة
  INSERT INTO projects (initiative_id, name_ar, name_en, start_date, end_date, owner_ar, owner_en, status, outputs_ar, outputs_en, sort_order)
  VALUES
  (v_init1_id, 'إعداد الخطة الاستراتيجية الاتصالية التسويقية للجامعة', 'Preparing the University Strategic Communication and Marketing Plan',
   '2026-01-01', '2026-06-30', 'وكالة العلاقات الخارجية', 'External Relations Agency', 'planned',
   'وثيقة الخطة الاستراتيجية الاتصالية التسويقية - استراتيجية القنوات والمحتوى - خطة الحملات التسويقية السنوية - مؤشرات الأداء', 'Strategic communication and marketing plan document - Channel and content strategy - Annual marketing campaign plan - KPIs', 1);

  -- Initiative 2: تعزيز التواصل الداخلي
  INSERT INTO projects (initiative_id, name_ar, name_en, start_date, end_date, owner_ar, owner_en, status, outputs_ar, outputs_en, sort_order)
  VALUES
  (v_init2_id, 'برنامج ضيافة نايف المتميزة (الخدمات الغذائية)', 'NAUSS Distinguished Hospitality Program (Food Services)',
   '2026-01-01', '2029-12-31', 'إدارة المراسم والضيافة', 'Protocol and Hospitality Dept', 'planned',
   'دليل إجراءات موحّد للضيافة - نظام إلكتروني لإدارة الضيافة - منظومة قياس رضا المستفيدين', 'Unified hospitality procedures guide - Electronic hospitality management system - Beneficiary satisfaction measurement system', 2),

  (v_init2_id, 'تطوير الإسكان الداخلي (الفندق)', 'Internal Housing Development (Hotel)',
   '2026-01-01', '2029-12-31', 'إدارة المرافق', 'Facilities Dept', 'planned',
   'تطوير الغرف الفندقية - تطوير المرافق المشتركة - تحديث صالات الاستقبال - تطوير استمارة تقييم تجربة السكن', 'Hotel room development - Common facilities upgrade - Reception hall renovation - Housing experience evaluation form', 3),

  (v_init2_id, 'تأهيل مطعم الجامعة للاعتماد في جودة خدمات المطاعم', 'University Restaurant Quality Accreditation',
   '2025-09-01', '2028-12-31', 'إدارة الخدمات', 'Services Dept', 'in_progress',
   'دليل إجراءات تشغيل المطعم وسلامة الغذاء - نظام رقابة داخلي - برنامج تدريبي للعاملين - نظام قياس رضا المستفيدين', 'Restaurant operation and food safety procedures guide - Internal control system - Staff training program - Beneficiary satisfaction measurement', 4),

  (v_init2_id, 'ترميم وتأهيل مرافق النادي الاجتماعي', 'Social Club Facilities Renovation',
   '2025-12-01', '2026-12-31', 'إدارة المرافق', 'Facilities Dept', 'in_progress',
   'إعادة تأهيل شاملة للمطبخ الرئيسي وصالة الطعام والكافتيريا وصالون VIP واستحداث صالون للفعاليات', 'Comprehensive renovation of main kitchen, dining hall, cafeteria, VIP lounge, and new events salon', 5),

  (v_init2_id, 'برنامج الفعاليات والأنشطة الرياضية السنوي', 'Annual Sports Events and Activities Program',
   '2026-01-01', '2029-12-31', 'إدارة الفعاليات', 'Events Dept', 'planned',
   'أجندة سنوية للفعاليات الرياضية الداخلية - تقارير دورية لقياس معدلات المشاركة ومستوى الرضا', 'Annual agenda for internal sports events - Periodic reports measuring participation and satisfaction', 6),

  (v_init2_id, 'تنظيم المناسبات والأنشطة الاجتماعية', 'Social Events and Activities Organization',
   '2026-01-01', '2029-12-31', 'إدارة المراسم', 'Protocol Dept', 'planned',
   'تطوير استبانة رضا المشاركين - برنامج عمل سنوي للأنشطة الاجتماعية - احتفال سنوي لعرض الإنجازات', 'Participant satisfaction survey - Annual social activities work program - Annual achievements celebration', 7),

  (v_init2_id, 'برنامج التواصل الداخلي الفعال', 'Effective Internal Communication Program',
   '2025-01-01', '2026-12-31', 'إدارة الاتصال المؤسسي', 'Institutional Communication Dept', 'in_progress',
   'سياسات وإجراءات موثقة للاتصال الداخلي - منصة رقمية موحدة للتواصل الداخلي', 'Documented internal communication policies and procedures - Unified digital internal communication platform', 8);

  -- Initiative 3: تنظيم فعاليات ذات أثر
  INSERT INTO projects (initiative_id, name_ar, name_en, start_date, end_date, owner_ar, owner_en, status, outputs_ar, outputs_en, sort_order)
  VALUES
  (v_init3_id, 'تخطيط وتنفيذ المنتدى الدولي الأمني', 'Planning and Implementing the International Security Forum',
   '2026-01-01', '2028-12-31', 'وكالة العلاقات الخارجية', 'External Relations Agency', 'planned',
   'اعتماد الخطة الأولية مع دراسة الجدوى - دليل إجراءات متكامل - منصة إلكترونية للمنتدى - توصيات لتطوير العمل الأمني العربي', 'Initial plan with feasibility study - Comprehensive procedures guide - Forum electronic platform - Recommendations for Arab security development', 9),

  (v_init3_id, 'استضافة النسخ الإقليمية لمؤتمرات العلوم الأمنية الدولية', 'Hosting Regional Editions of International Security Sciences Conferences',
   '2025-01-01', '2027-12-31', 'وكالة العلاقات الخارجية', 'External Relations Agency', 'in_progress',
   'قائمة سنوية محدثة بالمؤتمرات الدولية - استضافة مؤتمر علوم أمنية دولي - تقرير توثيقي تقييمي', 'Updated annual list of international conferences - Hosting international security sciences conference - Documentary evaluation report', 10),

  (v_init3_id, 'منصة الفعاليات الرقمية', 'Digital Events Platform',
   '2026-01-01', '2027-12-31', 'إدارة تقنية المعلومات', 'IT Dept', 'planned',
   'منصة إلكترونية لإدارة الفعاليات مع واجهة حسب دور المستخدمين', 'Electronic platform for event management with role-based user interfaces', 11),

  (v_init3_id, 'إعداد وتطوير آليات قياس أثر الفعاليات', 'Developing Event Impact Measurement Mechanisms',
   '2025-01-01', '2029-12-31', 'إدارة الفعاليات', 'Events Dept', 'in_progress',
   'لوحة معلومات تفاعلية لمؤشرات الأداء - تقارير تفصيلية عن نتائج قياس الأثر - نماذج استبيانات ذكية', 'Interactive KPI dashboard - Detailed impact measurement reports - Smart survey templates', 12);

  -- Initiative 4: العمل على تطوير شراكات
  INSERT INTO projects (initiative_id, name_ar, name_en, start_date, end_date, owner_ar, owner_en, status, outputs_ar, outputs_en, sort_order)
  VALUES
  (v_init4_id, 'إنشاء وتفعيل مجلس الشراكات والتعاون الدولي', 'Establishing and Activating the Partnerships and International Cooperation Council',
   '2025-12-01', '2029-12-31', 'وكالة العلاقات الخارجية', 'External Relations Agency', 'in_progress',
   'وثيقة تأسيس المجلس - تقييم شراكات الجامعة - اعتماد الخطط السنوية التنفيذية للشراكات', 'Council founding document - University partnership evaluation - Approved annual partnership implementation plans', 13),

  (v_init4_id, 'تفعيل مذكرات التفاهم الموقعة بخطط تنفيذ سنوية', 'Activating Signed MOUs with Annual Implementation Plans',
   '2025-01-01', '2029-12-31', 'إدارة التعاون الدولي', 'International Cooperation Dept', 'in_progress',
   'نسبة مذكرات التفاهم المفعلة لخدمة ركائز البحث العلمي والبرامج الأكاديمية والتدريب والفعاليات', 'Percentage of activated MOUs serving research, academic programs, training, and events pillars', 14),

  (v_init4_id, 'برنامج تعزيز العلاقات مع السفارات السنوي', 'Annual Embassy Relations Enhancement Program',
   '2025-01-01', '2029-12-31', 'إدارة المجالس والعلاقات العربية', 'Arab Relations Dept', 'in_progress',
   'مشاركات في فعاليات السفارات الأجنبية والعربية - توثيق سنوي للمشاركات', 'Participation in foreign and Arab embassy events - Annual documentation of participations', 15),

  (v_init4_id, 'تنظيم مشاركة الجامعة في الاجتماعات العربية', 'Organizing University Participation in Arab Meetings',
   '2025-01-01', '2029-12-31', 'إدارة المجالس والعلاقات العربية', 'Arab Relations Dept', 'in_progress',
   'برنامج الجامعة العربي للاجتماعات - تعزيز المشاركة الفعالة ومتابعة تنفيذ التوصيات', 'University Arab meeting program - Enhanced effective participation and follow-up on recommendations', 16),

  (v_init4_id, 'حوكمة وتفعيل برنامج عمل الجامعة السنوي', 'Governance and Activation of the University Annual Work Program',
   '2025-01-01', '2029-12-31', 'وكالة العلاقات الخارجية', 'External Relations Agency', 'in_progress',
   'تنفيذ 100% من برنامج عمل الجامعة السنوي - رفع نسبة الحضور العربي', '100% implementation of annual work program - Increased Arab attendance', 17),

  (v_init4_id, 'استضافة أمانات ومكاتب تنسيق علمي مع المنظمات الدولية والأممية', 'Hosting Secretariats and Scientific Coordination Offices with International Organizations',
   '2025-01-01', '2029-12-31', 'إدارة التعاون الدولي', 'International Cooperation Dept', 'in_progress',
   'خطة تشغيلية سنوية للتنسيق مع المنظمات الأممية - تقارير متابعة دورية - إنشاء الأمانات العامة ومكاتب التنسيق', 'Annual operational plan for UN coordination - Periodic follow-up reports - Establishing secretariats and coordination offices', 18);

  -- Initiative 5: خطة شاملة للخدمة المجتمعية
  INSERT INTO projects (initiative_id, name_ar, name_en, start_date, end_date, owner_ar, owner_en, status, outputs_ar, outputs_en, sort_order)
  VALUES
  (v_init5_id, 'برنامج الحملات التوعوية الأمنية بالتنسيق مع المراكز البحثية وقطاعات الجامعة', 'Security Awareness Campaigns Program in Coordination with Research Centers',
   '2025-01-01', '2029-12-31', 'إدارة خدمة المجتمع', 'Community Service Dept', 'in_progress',
   'برنامج سنوي معتمد للحملات التوعوية الأمنية - دليل إرشادي للمشاركة التطوعية - مؤشر مشاركة المتطوعين', 'Approved annual security awareness campaign program - Volunteer participation guide - Volunteer participation indicator', 19);

END $$;

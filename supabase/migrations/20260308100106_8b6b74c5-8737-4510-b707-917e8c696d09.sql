
ALTER TABLE public.kpis
ADD COLUMN description_ar text NOT NULL DEFAULT '',
ADD COLUMN description_en text NOT NULL DEFAULT '',
ADD COLUMN data_source_ar text NOT NULL DEFAULT '',
ADD COLUMN data_source_en text NOT NULL DEFAULT '',
ADD COLUMN calculation_method_ar text NOT NULL DEFAULT '',
ADD COLUMN calculation_method_en text NOT NULL DEFAULT '',
ADD COLUMN supporting_references_ar text NOT NULL DEFAULT '',
ADD COLUMN supporting_references_en text NOT NULL DEFAULT '',
ADD COLUMN measurement_frequency text NOT NULL DEFAULT '';

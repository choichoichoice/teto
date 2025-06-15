-- 공유된 분석 결과를 저장하는 테이블
CREATE TABLE shared_results (
  id UUID PRIMARY KEY,
  analysis_result JSONB NOT NULL,
  development_tips JSONB,
  image_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX idx_shared_results_created_at ON shared_results(created_at);

-- RLS (Row Level Security) 비활성화 (공개 읽기 허용)
ALTER TABLE shared_results ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 설정
CREATE POLICY "Anyone can read shared results" ON shared_results
  FOR SELECT USING (true);

-- 모든 사용자가 새로운 결과를 생성할 수 있도록 정책 설정
CREATE POLICY "Anyone can create shared results" ON shared_results
  FOR INSERT WITH CHECK (true);

-- 30일 후 자동 삭제를 위한 함수 (선택사항)
CREATE OR REPLACE FUNCTION delete_old_shared_results()
RETURNS void AS $$
BEGIN
  DELETE FROM shared_results 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- 매일 자정에 오래된 결과 삭제 (선택사항)
-- SELECT cron.schedule('delete-old-shared-results', '0 0 * * *', 'SELECT delete_old_shared_results();'); 
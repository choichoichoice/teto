export default function TestHeader() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">헤더 테스트 페이지</h1>
        <p className="mb-4">
          이 페이지는 헤더의 링크들이 정상적으로 작동하는지 테스트하기 위한 페이지입니다.
        </p>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">테스트 방법:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>상단 헤더의 "홈" 링크를 클릭해보세요</li>
            <li>상단 헤더의 "분석하기" 링크를 클릭해보세요</li>
            <li>상단 헤더의 "로그인" 버튼을 클릭해보세요</li>
            <li>상단 헤더의 "회원가입" 버튼을 클릭해보세요 (데스크톱에서만 보임)</li>
          </ul>
        </div>
        
        <div className="mt-8 bg-yellow-50 p-4 rounded border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">브라우저 콘솔 확인:</h3>
          <p className="text-yellow-700">
            F12 키를 눌러 개발자 도구를 열고 Console 탭에서 클릭 이벤트 로그를 확인하세요.
          </p>
        </div>
      </div>
    </div>
  )
} 
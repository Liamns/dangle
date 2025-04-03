export async function getRandomNickname(): Promise<string> {
  try {
    const response = await fetch(
      "https://www.rivestsoft.com/nickname/getRandomNickname.ajax",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lang: "ko" }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const resData = await response.json();
    // 응답 객체에서 data 프로퍼티에 결과가 담겨있다고 가정합니다.
    return resData.data;
  } catch (error) {
    console.error("네트워크 오류:", error);
    throw error;
  }
}

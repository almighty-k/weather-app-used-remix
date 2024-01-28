/**
 * 日付から年を取り除き, 日月のみの形式で返す
 * @param dateTime 例:"2024-01-27 or 2024-01-27 13:08"
 * @returns 例:"27/01"
 */
export function getMonthAndDate(dateTime: string) {
  const [date] = dateTime.split(" ");
  // 配列の第一引数は使用しないため、_で受け取り、lintエラーを無視する
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, month, day] = date.split("-");
  return `${day}/${month}`;
}

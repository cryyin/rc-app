/**
 * 上一个年月
 * @returns {string} last year month
 */
export const getLastYearMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    if(month !== 0){
        return year + "" + (month < 10 ? '0'+month : month)
    }
    return (year-1)+""+12
}

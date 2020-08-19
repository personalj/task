export default function dateTimeFilter(value) {
        const date = new Date(value)
        let hours= date.getHours();
        hours = ("0" + hours).slice(-2);
        let minutes = date.getMinutes(); 
        minutes = ("0" + minutes).slice(-2);
        const seconds = date.getSeconds();
        const day = date.getDate()
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[date.getMonth()]
        const time = `${hours}:${minutes}`
        let data
        if(value === '') {
           data = ''     
        }else {
           data =  `${day} ${monthName} ${time}` 
        }
        return data
}
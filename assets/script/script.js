const countrySelection=document.querySelector("#selCountry")
const loadingdiv=document.querySelector('.loading')
const weatherresultdiv=document.querySelector('.weather-result')
const weatherdiv=document.querySelector('.weather')
import * as countries from './countries.json' assert {type : 'json'}
var data={
    wind:'',
    pressure:'',
    humidity:'',
    visibility:'',
}
var weather={
    weather:[],
    temp:0
}
window.onload=async()=>{
    generatelist(countries.default,countrySelection,'option','index','city')
    getweather()
    await getWeatherFromDB(30.0561,31.2394)
    setweather()
}
const generatelist=(list,parent,child,value='',innerhtml)=>{
    list.forEach((ele,index) => {
        var option=document.createElement(child)
        if(value!=''&&value=='index')option.setAttribute('value',index)
        option.innerHTML=ele[innerhtml]
        parent.appendChild(option)
    });
    parent.querySelector('option').setAttribute('selected',true)
}
const getWeatherFromDB=async (lat,lon)=>{
    await fetch(`https://api.weatherapi.com/v1/current.json?key=377a089234ad4ba1ad1152042230811&q=${lat},${lon}&aqi=no&days=5&lang=ar`,{
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            'mode': 'block'
        }
    }).then(
        res=>{return res.json()}
        ).then(
            res=>{
                console.log(res)
                data={
                        wind:(res.current.wind_kph)+"كم / ساعه",
                        pressure:(res.current.pressure_mb),
                        humidity:(res.current.humidity)+"%",
                        visibility:(parseInt(res.current.vis_km))+"كم",
                }
                if(res.current.pressure_mb>1000){
                    data['pressure']='الضغط مرتفع'
                }
                else{data['pressure']='الضغط منخفض'}
                weather={
                    weather:res.current.condition.text,
                    temp:parseInt(res.current.temp_c),
                    icon:res.current.condition.icon
                }
            }
        )
}
const setweather=()=>{
    let i=0
    for (const key in data) {
        weatherdiv.querySelectorAll('p')[i].innerHTML=data[key];
        i++;
    }
    weatherresultdiv.querySelector('img').setAttribute('src',weather.icon)  
    weatherresultdiv.querySelectorAll('p')[0].innerHTML=weather.weather
    weatherresultdiv.querySelectorAll('p')[1].innerHTML=''
    weatherresultdiv.querySelectorAll('p')[1].insertAdjacentHTML(
        'afterbegin',
        `<span>${weather.temp}<sup>&dot;C</sup></span>`,
      );
}
const getweather=()=>{
    countrySelection.addEventListener("change",async(event)=>{
        let index=event.target.value
        loadingdiv.style.display='block'
        await getWeatherFromDB(countries.default[index].lat,countries.default[index].lon)
        loadingdiv.style.display='none'
        setweather()
    })
}

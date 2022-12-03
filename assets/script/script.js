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
    await fetch(`http://localhost:3000?lat=${lat}&lon=${lon}`,{
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    }).then(
        res=>{return res.json()}
        ).then(
            res=>{
                data={
                        wind:(res.wind.speed)+"m/s",
                        pressure:(res.main.pressure),
                        humidity:(res.main.humidity)+"%",
                        visibility:(parseInt(res.visibility / 1000))+"Km",
                }
                if(res.main.pressure>1000){
                    data['pressure']='الضغط مرتفع'
                }
                else{data['pressure']='الضغط منخفض'}
                weather={
                    weather:res.weather,
                    temp:parseInt(res.main.temp)
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
    if(weather.weather[0].main.toLowerCase()=='clear'){
        weatherresultdiv.querySelector('img').setAttribute('src','assets/images/clear.png')
    }
    else if(weather.weather[0].main.toLowerCase()=='clouds'){
        weatherresultdiv.querySelector('img').setAttribute('src','assets/images/clouds.png')  
    }
    weatherresultdiv.querySelectorAll('p')[0].innerHTML=weather.weather[0].description
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

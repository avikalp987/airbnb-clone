import countries from "world-countries"

const formattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: country.flag,
    latlng: country.latlng,
    region: country.region,
}))

const useCountries = () => {
    //getting all the countries
    const getAll = ()=>formattedCountries

    //getting the country by value
    const getByValue = (value: string)=>{
        return formattedCountries.find((item) => item.value===value)
    }

    return {
        getAll,
        getByValue
    }
}

export default useCountries
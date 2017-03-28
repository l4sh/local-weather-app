(function() {
  var weather = {
    locationApiUrl: 'https://freegeoip.net/json/',
    apiUrl: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22$LOCATION$%22)&format=json',

    conditions: [
      // clearDay
      {
        codes: [32, 34, 36],
        icon: 'ion-ios-sunny-outline',
        heroClass: 'is-warning'
      },

      // clearNight
      {
        codes: [31, 33],
        icon: 'ion-ios-moon-outline',
        heroClass: 'is-dark'
      },

      // cloud
      {
        codes: [19, 20, 21, 22, 23, 24, 25, 26],
        icon: 'ion-ios-cloudy-outline',
        heroClass: 'is-light'
      },

      // cloudyDay
      {
        codes: [28, 30, 44],
        icon: 'ion-ios-partlysunny-outline',
        heroClass: 'is-warning'
      },

      // cloudyNight
      {
        codes: [27, 29],
        icon: 'ion-ios-cloudy-night-outline',
        heroClass: 'is-dark'
      },

      // rain
      {
        codes: [9, 11, 12, 40],
        icon: 'ion-ios-rainy-outline',
        heroClass: 'is-info'
      },

      // thunderstorm
      {
        codes: [0, 1, 2, 3, 4, 37, 38, 39, 45, 47],
        icon: 'ion-ios-thunderstorm-outline',
        heroClass: 'is-dark'
      },

      // snow
      {
        codes: [5, 6, 7, 8, 10, 13, 14, 15, 16, 17, 18, 35, 41, 42, 43, 46],
        icon: 'ion-ios-snowy',
        heroClass: 'is-light'
      },

      // notAvailable
      {
        codes: [3200],
        icon: 'ion-alert',
        heroClass: 'is-danger'
      }
    ]
  };

  /** Get user location depending on the IP **/
  axios.get(weather.locationApiUrl)
    .then(function(response) {
      var location = response.data.city;
      location += '%20' + response.data.region_name;
      location += '%20' + response.data.country_name;

      /** Get current weather for the detected location and update DOM **/
      axios.get(weather.apiUrl.replace('$LOCATION$', location))
        .then(function(response) {
          var item = response.data.query.results.channel.item;
          var condition = weather.conditions.filter(function(condition) {
            return condition.codes.indexOf(Number(item.condition.code)) !== -1;
          })[0];

          document.getElementById('weather-icon').className = 'ionicons ' + condition.icon;
          document.getElementById('weather-text').innerHTML = item.condition.text;
          document.getElementById('weather-location').innerHTML = item.title;
          document.getElementById('weather-temp').innerHTML = item.condition.temp + '°F';
          document.getElementById('weather-container').className = 'hero is-fullheight ' + condition.heroClass;
        });
    });

  // Switch between Fahrenheit & Celcius
  document.getElementById('weather-temp').addEventListener('click', switchTemp);

  function roundDecimals(number, places) {
    places = places || 2;
    
    var mult = Math.pow(10, places);
    var rounded = Math.round(number * mult) / mult;
    
    return rounded;
  }
  /**
   * Switch between fahrenheit to celcius and vice-versa
   */
  function switchTemp(event) {
    var temp = this.innerHTML.split('°');

    if (temp[1] === 'F') {
      temp[0] = roundDecimals((temp[0] - 32) / 1.8, 1);
      temp[1] = 'C';
    } else {
      temp[0] = roundDecimals((temp[0] * 1.8) + 32, 1);
      temp[1] = 'F';
    }

    this.innerHTML = temp.join('°');
  }
  
})();
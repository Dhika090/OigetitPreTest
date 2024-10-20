   async function getSentimentData() {
       const response = await fetch('https://ai.oigetit.com/AI71/Histogram', {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
           }
       });

       const data = await response.json();
       return data;
   }

   function displaySentiment(sentiment) {
       if (sentiment < -4) {
           return 'Very Negative';
       } else if (sentiment < 0) {
           return 'Negative';
       } else if (sentiment === 0) {
           return 'Neutral';
       } else if (sentiment > 0 && sentiment <= 4) {
           return 'Positive';
       } else if (sentiment > 4) {
           return 'Very Positive';
       }
   }

   async function renderSentimentChart() {
       const sentimentData = await getSentimentData();

       const labels = sentimentData.map(item => item.date);
       const positiveSentiments = sentimentData.map(item => item.positive);
       const neutralSentiments = sentimentData.map(item => item.neutral);
       const negativeSentiments = sentimentData.map(item => item.negative);

       Highcharts.chart('sentimentChart', {
           title: {
               text: 'Sentiment in Real-Time'
           },
           xAxis: {
               categories: ['April', 'May', 'June', 'July', 'August', 'September']
           },
           yAxis: {
               title: {
                   text: 'Volume'
               },
               tickInterval: 10
           },
           series: [{
               name: 'Positive',
               data: [90, 80, 85, 95, 100, 90],
               color: 'green'
           }, {
               name: 'Neutral',
               data: [50, 45, 55, 50, 60, 55],
               color: 'orange'
           }, {
               name: 'Negative',
               data: [30, 40, 35, 45, 50, 40],
               color: 'red'
           }]
       });
   }

   renderSentimentChart();

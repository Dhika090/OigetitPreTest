async function getSentimentData() {
    try {
        const response = await fetch('https://ai.oigetit.com/AI71/Histogram?json=%7B%22StartDate%22:%222024-09-01%22,%22EndDate%22:%222024-10-01%22,%22Query%22:%22UAE%22%7D');
        const data = await response.json();
        console.log('API Data:', data); // Log the response to inspect its structure
        return data; // Return the API data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function renderSentimentChart() {
    const sentimentData = await getSentimentData();

    if (sentimentData && sentimentData.length > 0) {

        const categories = sentimentData.map(entry => entry.pubdate);
        const positiveData = sentimentData.map(entry => entry.volume_pos);
        const neutralData = sentimentData.map(entry => entry.volume_neu);
        const negativeData = sentimentData.map(entry => entry.volume_neg);

        const mediaMentionsData = sentimentData.map(entry => ({
            week: entry.pubdate,
            volume: entry.volume_pos + entry.volume_neu + entry.volume_neg,
            positive: entry.volume_pos,
            negative: entry.volume_neg,
            neutral: entry.volume_neu
        }));

        Highcharts.chart('sentiment-bar-chart', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Media Mentions'
            },
            xAxis: {
                title: {
                    text: 'Weeks'
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                tickInterval: 10,
                title: {
                    text: 'Volume'
                }
            },
            tooltip: {
                useHTML: true, 
                formatter: function () {
                    const mention = mediaMentionsData[this.point.index];
                    const sentiment =
                        mention.positive > mention.negative ?
                        `<span style="color: green;">Positive</span>` // Green for Positive
                        :
                        mention.negative > mention.positive ?
                        `<span style="color: red;">Negative</span>` // Red for Negative
                        :
                        `<span style="color: orange;">Neutral</span>`; // Orange for Neutral

                    return `
                        <b>Date:</b> ${mention.week}<br>
                        <b>Volume:</b> ${mention.volume}<br>
                        <b>Positive:</b> ${mention.positive}<br>
                        <b>Negative:</b> ${mention.negative}<br>
                        <b>Neutral:</b> ${mention.neutral}<br>
                        <b>Sentiment:</b> ${sentiment}
                    `;
                }
            },
            series: [{
                name: 'Volume',
                data: mediaMentionsData.map(item => item.volume),
                color: '#698ffe'
            }],
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        format: '{y}'
                    }
                }
            }
        });

    } else {
        console.error('No valid data found.');
    }
}

renderSentimentChart();
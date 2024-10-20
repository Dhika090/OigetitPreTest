async function getReputationData() {
    try {
        const response = await fetch('https://ai.oigetit.com/AI71/Country');
        const data = await response.json();
        console.log('Reputation Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function classifySentiment(value) {
    if (value > 0.5) return {
        label: 'Positive',
        color: '#1abc9c'
    }; // Green
    if (value < -0.5) return {
        label: 'Negative',
        color: '#e74c3c'
    }; // Red
    return {
        label: 'Neutral',
        color: '#f1c40f'
    }; // Yellow
}

async function renderReputationMap() {
    const reputationData = await getReputationData();

    const mapData = reputationData.map(entry => {
        const {
            label,
            color
        } = classifySentiment(entry.sentiment);
        return {
            'hc-key': entry.country.toLowerCase(), // ISO-2 country code
            value: entry.sentiment,
            volume: entry.volume,
            sentiment: label,
            color: color
        };
    });

    Highcharts.mapChart('reputation-map', {
        chart: {
            map: 'custom/world'
        },
        title: {
            text: 'Reputation Map'
        },
        legend: {
            title: {
                text: 'Sentiment',
                style: {
                    fontWeight: 'bold'
                }
            },
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            itemDistance: 20,
            itemStyle: {
                fontSize: '14px'
            }
        },
        colorAxis: {
            dataClasses: [{
                    from: 0.51,
                    color: '#1abc9c',
                    name: 'Positive'
                }, // Green
                {
                    from: -0.5,
                    to: 0.5,
                    color: '#f1c40f',
                    name: 'Neutral'
                }, // Yellow
                {
                    to: -0.51,
                    color: '#e74c3c',
                    name: 'Negative'
                }, // Red
                {
                    color: '#95a5a6',
                    name: 'No Mention'
                } // Gray
            ]
        },
        tooltip: {
            formatter: function () {
                const {
                    sentiment,
                    volume,
                    value
                } = this.point;
                return `
                    <b>Country:</b> ${this.point['hc-key'].toUpperCase()}<br>
                    <b>Sentiment:</b> ${sentiment}<br>
                    <b>Score:</b> ${value.toFixed(2)}<br>
                    <b>Volume:</b> ${volume}
                `;
            }
        },
        series: [{
            data: mapData,
            joinBy: 'hc-key',
            name: 'Sentiment',
            states: {
                hover: {
                    color: '#3498db' // Blue highlight on hover
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point["hc-key"].toUpperCase()}'
            }
        }]
    });
}

document.addEventListener('DOMContentLoaded', renderReputationMap);
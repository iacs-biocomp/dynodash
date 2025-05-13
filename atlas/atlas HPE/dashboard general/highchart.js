function chart() {

    let instance = {
        title: {
            text: 'My custom title'
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }]
    }


    instance.addTitle = function (tl) {
        if (!arguments.length) return tl;
        else {
            this.title.text = tl;
            return instance;
        }
    };

    instance.chartType = function (type) {
        if (!arguments.length) return type;
        else {
            this.chart.type = type;
            return instance;
        }
    }

    // Accesor para data
    instance.addSeries = function (d) {
        if (!arguments.length) return data;
        else {
            this.series = d;
            return instance;
        }
    };

    const initialize = () => {
        const chart = new Highcharts.Chart('chart', instance);
    }

    instance.paint = () => {
        initialize()
        return instance
    }

    return instance
}
const graphModel = require('../../models/trains/GraphModel');


function undirectedGraph(){};


undirectedGraph.prototype.getData = () => {

    let graph = new graphModel(7, 9, 0, 0);
    let data = {
        adjac      : graph.adjac,
        countVertex: graph.countVertex,
        reflex     : graph.reflex,
        orient     : graph.orient,
    }
    console.log(data)
    return data;
}


undirectedGraph.prototype.checkAnswer = (data) => {
    let result = 1;
    return result;
}


module.exports = undirectedGraph;

async function getJSON() {
  const response = await fetch(
    "db/starwars-full-interactions-allCharacters.json"
  );
  const data = await response.json();
  return data;
}

async function getEpisodeJson() {
  const ep1 = await fetch(
    "db/starwars-episode-1-interactions-allCharacters.json"
  );
  const ep2 = await fetch(
    "db/starwars-episode-2-interactions-allCharacters.json"
  );
  const ep3 = await fetch(
    "db/starwars-episode-3-interactions-allCharacters.json"
  );
  const ep4 = await fetch(
    "db/starwars-episode-4-interactions-allCharacters.json"
  );
  const ep5 = await fetch(
    "db/starwars-episode-5-interactions-allCharacters.json"
  );
  const ep6 = await fetch(
    "db/starwars-episode-6-interactions-allCharacters.json"
  );
  const ep7 = await fetch(
    "db/starwars-episode-7-interactions-allCharacters.json"
  );

  const ep1Data = await ep1.json();
  const ep2Data = await ep2.json();
  const ep3Data = await ep3.json();
  const ep4Data = await ep4.json();
  const ep5Data = await ep5.json();
  const ep6Data = await ep6.json();
  const ep7Data = await ep7.json();

  for (var i = 0; i < ep1Data.links.length; i++) {
    ep1Data.links[i].episode = 1;
    ep1Data.links[i].target = ep1Data.nodes[ep1Data.links[i].target].name;
    ep1Data.links[i].source = ep1Data.nodes[ep1Data.links[i].source].name;
  }
  for (var i = 0; i < ep2Data.links.length; i++) {
    ep2Data.links[i].episode = 2;
    ep2Data.links[i].target = ep2Data.nodes[ep2Data.links[i].target].name;
    ep2Data.links[i].source = ep2Data.nodes[ep2Data.links[i].source].name;
  }
  for (var i = 0; i < ep3Data.links.length; i++) {
    ep3Data.links[i].episode = 3;
    ep3Data.links[i].target = ep3Data.nodes[ep3Data.links[i].target].name;
    ep3Data.links[i].source = ep3Data.nodes[ep3Data.links[i].source].name;
  }
  for (var i = 0; i < ep4Data.links.length; i++) {
    ep4Data.links[i].episode = 4;
    ep4Data.links[i].target = ep4Data.nodes[ep4Data.links[i].target].name;
    ep4Data.links[i].source = ep4Data.nodes[ep4Data.links[i].source].name;
  }
  for (var i = 0; i < ep5Data.links.length; i++) {
    ep5Data.links[i].episode = 5;
    ep5Data.links[i].target = ep5Data.nodes[ep5Data.links[i].target].name;
    ep5Data.links[i].source = ep5Data.nodes[ep5Data.links[i].source].name;
  }
  for (var i = 0; i < ep6Data.links.length; i++) {
    ep6Data.links[i].episode = 6;
    ep6Data.links[i].target = ep6Data.nodes[ep6Data.links[i].target].name;
    ep6Data.links[i].source = ep6Data.nodes[ep6Data.links[i].source].name;
  }
  for (var i = 0; i < ep7Data.links.length; i++) {
    ep7Data.links[i].episode = 7;
    ep7Data.links[i].target = ep7Data.nodes[ep7Data.links[i].target].name;
    ep7Data.links[i].source = ep7Data.nodes[ep7Data.links[i].source].name;
  }

  var allLinks = ep1Data.links.concat(
    ep2Data.links,
    ep3Data.links,
    ep4Data.links,
    ep5Data.links,
    ep6Data.links,
    ep7Data.links
  );
  var allNodes = ep1Data.nodes.concat(
    ep2Data.nodes,
    ep3Data.nodes,
    ep4Data.nodes,
    ep5Data.nodes,
    ep6Data.nodes,
    ep7Data.nodes
  );
  // remove duplicates, sum up values
  allNodes = allNodes.reduce((unique, o) => {
    if (!unique.some((obj) => obj.name === o.name)) {
      unique.push(o);
    } else {
      unique.find((obj) => obj.name === o.name).value += o.value;
      //unique.find((obj) => obj.name === o.name).episode += o.episode;
    }
    return unique;
  }, []);
  return { nodes: allNodes, links: allLinks };
}

async function run() {
  var data = await getJSON();
  var epData = await getEpisodeJson();
  data = epData;

  console.log(data);

  var nodes = data.nodes;
  const nodes2 = data.nodes;
  var links = data.links;
  const links2 = data.links;

  const width = window.innerWidth;
  const height = window.innerHeight;

  var svgLeft = d3
    .select("body")
    .append("svg")
    .attr("width", width / 2)
    .attr("height", height);

  var svgRight = d3
    .select("body")
    .append("svg")
    .attr("width", width / 2)
    .attr("height", height);

  var simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id(function (d) {
        return d.name;
      })
    )
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 4, height / 2))
    .force("gravity", d3.forceManyBody().strength(-25));

  var simulation2 = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id(function (d) {
        return d.name;
      })
    )
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 4, height / 2))
    .force("gravity", d3.forceManyBody().strength(-10));

  var link = drawLinks(links);
  var link2 = drawLinksRight(links2);

  var node = drawNodes(nodes);
  var node2 = drawNodesRight(nodes2);

  // tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var tooltipTitle = tooltip.append("h1").attr("class", "tooltip-title");
  var tooltipSubtitle = tooltip.append("h2").attr("class", "tooltip-subtitle");

  simulation.nodes(nodes).on("tick", ticked);
  simulation2.nodes(nodes2).on("tick", ticked2);

  simulation
    .force("link")
    .links(links)
    .distance(150)
    .strength(0.1)
    .iterations(5);

  simulation2
    .force("link")
    .links(links2)
    .distance(150)
    .strength(0.1)
    .iterations(5);

  //changeEpisode([1, 2, 3])

  attachHoverEvent();
  attachHoverEventRight();

  var episodeSelector = d3
    .select("#episodeSelector")
    .style("opacity", 1)
    .style("position", "absolute");

  //get checked episodes and update graph
  episodeSelector.on("change", (event) => {
    var checkedEpisodes = [];
    d3.selectAll("input").each(function (d) {
      cb = d3.select(this);
      if (cb.property("checked")) {
        checkedEpisodes.push(cb.property("value"));
      }
    });
    changeEpisode(checkedEpisodes);
    //console.log(checkedEpisodes);
  });

  function attachHoverEvent() {
    node
      .on("mouseover", (event, d) => {
        d3.select(event.target).transition(200).attr("r", 15);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltipSubtitle.transition().duration(200).style("opacity", 0.9);
        tooltipTitle
          .html(d.name)
          .style("position", "absolute")
          .style("font-family", "sans-serif")
          .style("left", 20 + "px")
          .style("top", 28 + "px");
        tooltipSubtitle
          .html("Appears in: " + d.value + " scenes")
          .style("position", "absolute")
          .style("font-family", "sans-serif")
          .style("left", 20 + "px")
          .style("top", 70 + "px");
        link.style("stroke", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return "#FFFFFF";
          } else {
            return "#555555";
          }
        }).style("opacity", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return 0.9;
          } else {
            return 0.1;
          }
        });
        d3.selectAll(".node2")
          .filter(function (l) {
            console.log(l.name, d.name)
            return d.name === l.name;
          })
          .attr('r', 15)
        link2.style("stroke", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return "#FFFFFF";
          } else {
            return "#555555";
          }
        }).style("opacity", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return 0.9;
          } else {
            return 0.1;
          }
        });
      })
      .on(
        "mouseout",
        (event, d) => {
          tooltip.transition().duration(50).style("opacity", 0);
          d3.select(event.target).transition(200).attr("r", 10);
          tooltipSubtitle.html("");
          tooltipTitle.html("");
          link.style("stroke", "#555555").style("opacity", 1);
          d3.selectAll(".node2").transition(200).attr('r', 10);
          link2.style("stroke", "#555555").style("opacity", 1);
        }
      );

    link.on("mouseover", (event, d) => {
      d3.select(event.target)
        .transition(200)
        .style("stroke-width", 5)
        .style("stroke", "rgb(255, 255, 255)");

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltipSubtitle.transition().duration(200).style("opacity", 0.9);
      tooltipTitle
        .html(d.source.name + " - " + d.target.name)
        .style("position", "absolute")
        .style("font-family", "sans-serif")
        .style("left", 20 + "px")
        .style("top", 28 + "px");
    }).on("mouseout", (event, d) => {
      d3.select(event.target)
        .transition(200)
        .style("stroke-width", 1)
        .style("stroke", "#555555");
      tooltip.transition().duration(50).style("opacity", 0);
      tooltipTitle.html("");
      tooltipSubtitle.html("");
    });
  }

  function attachHoverEventRight() {
    node2
      .on("mouseover", (event, d) => {
        d3.select(event.target).transition(200).attr("r", 15);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltipSubtitle.transition().duration(200).style("opacity", 0.9);
        tooltipTitle
          .html(d.name)
          .style("position", "absolute")
          .style("font-family", "sans-serif")
          .style("left", 20 + "px")
          .style("top", 28 + "px");
        tooltipSubtitle
          .html("Appears in: " + d.value + " scenes")
          .style("position", "absolute")
          .style("font-family", "sans-serif")
          .style("left", 20 + "px")
          .style("top", 70 + "px");
        link2.style("stroke", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return "#FFFFFF";
          } else {
            return "#555555";
          }
        }).style("opacity", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return 0.9;
          } else {
            return 0.1;
          }
        });
        d3.selectAll(".node")
          .filter(function (l) {
            console.log(l.name, d.name)
            return d.name === l.name;
          })
          .attr('r', 15);
        link.style("stroke", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return "#FFFFFF";
          } else {
            return "#555555";
          }
        }).style("opacity", (l) => {
          if (l.source.name === d.name || l.target.name === d.name) {
            return 0.9;
          } else {
            return 0.1;
          }
        });
      })

      .on(
        "mouseout",
        (event,
          (d) => {
            document.getElementById(event.target.id.toString()).style.transform = "scale(1.0)";
            tooltip.transition().duration(50).style("opacity", 0);
            d3.select(event.target).transition(200).attr("r", 10);
            link2.style("stroke", "#555555");
            d3.select(".node").transition(200).attr('r', 10);
            link.style("stroke", "#555555");
            link.style("opacity", 1);
            link2.style("opacity", 1);
          })
      );

    link2.on("mouseover", (event, d) => {
      d3.select(event.target)
        .transition(200)
        .style("stroke-width", 5)
        .style("stroke", "rgb(255, 255, 255)");

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltipSubtitle.transition().duration(200).style("opacity", 0.9);
      tooltipTitle
        .html(d.source.name + " - " + d.target.name)
        .style("position", "absolute")
        .style("font-family", "sans-serif")
        .style("left", 20 + "px")
        .style("top", 28 + "px");
    }).on("mouseout", (event, d) => {
      d3.select(event.target)
        .transition(200)
        .style("stroke-width", 1)
        .style("stroke", "#555555");
      tooltip.transition().duration(50).style("opacity", 0);
      tooltipTitle.html("");
      tooltipSubtitle.html("");
    });
  }

  function changeEpisode(episodeArray) {
    var epLinks = links.filter(function (link) {
      return episodeArray.indexOf(link.episode.toString()) != -1;
    });

    var epNodes = nodes.filter(function (node) {
      for (var i = 0; i < epLinks.length; i++) {
        if (
          epLinks[i].source.name == node.name ||
          epLinks[i].target.name == node.name
        ) {
          return true;
        }
      }
    });
    console.log("eplinks", epLinks);
    if (epLinks.length == 0) {
      epLinks = links;
    }
    if (epNodes.length == 0) {
      epNodes = nodes;
    }
    simulation.force("link").links(epLinks);
    simulation.alpha(1).restart();

    link.remove();
    link = drawLinks(epLinks);

    node.remove();
    node = drawNodes(epNodes);

    attachHoverEvent();
  }

  function ticked() {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  function ticked2() {
    link2
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    node2
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  function drawNodes(dataPoints) {
    result = svgLeft
      .selectAll(".node")
      .data(dataPoints)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("id", function (d) {
        return d.name.replace(/\s/g, "")
      })
      .attr("r", 10)
      .attr("fill", function (d) {
        return d.colour;
      })
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) {
              simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            }
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) {
              simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            }
          })
      );
    return result;
  }

  function drawNodesRight(dataPoints) {
    result = svgRight
      .selectAll(".node")
      .data(dataPoints)
      .enter()
      .append("circle")
      .attr("class", "node2")
      .attr("id", function (d) {
        return d.name.replace(/\s/g, "")
      })
      .attr("r", 10)
      .attr("fill", function (d) {
        return d.colour;
      })
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) {
              simulation2.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            }
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) {
              simulation2.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            }
          })
      );
    return result;
  }

  function drawLinks(dataPoints) {
    result = svgLeft
      .selectAll(".link")
      .data(dataPoints)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", 2)
      .attr("stroke", "#555555")
      .attr("opacity", 0.5);
    return result;
  }

  function drawLinksRight(dataPoints) {
    result = svgRight
      .selectAll(".link")
      .data(dataPoints)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", 2)
      .attr("stroke", "#555555")
      .attr("opacity", 0.5);
    return result;
  }
}
run();

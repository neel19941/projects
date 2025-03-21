import asyncio
import json
import random
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64

"""Generates an async health check for a node."""
async def node_health_status(component: str):
    await asyncio.sleep(0.5)
    return {"component": component, "status": random.choice(["Healthy", "Unhealthy"])}

"""BFS asynchronous check on input DAG."""
async def traverse_system(dag, start_node):
    queue = asyncio.Queue()
    await queue.put(start_node)
    visited_node = set()
    health_status = {}

    while not queue.empty():
        tasks = []
        for _ in range(queue.qsize()):
            node = await queue.get()
            if node in visited_node:
                continue
            visited_node.add(node)
            tasks.append(node_health_status(node))

        results = await asyncio.gather(*tasks)
        for result in results:
            health_status[result["component"]] = result["status"]
            for neighbor in dag.get(result["component"], []):
                if neighbor not in visited_node:
                    await queue.put(neighbor)

    return health_status

"""create a DAG image with healthy/unhealthy nodes highlighted."""
def graph_representation(dag, health_status):
    G = nx.DiGraph(dag)
    pos = nx.spring_layout(G)
    plt.figure(figsize=(8, 6))
    node_colors = ["red" if health_status[node] == "Unhealthy" else "green" for node in G.nodes]
    nx.draw(G, pos, with_labels=True, node_color=node_colors, edge_color="black", node_size=2000, font_size=10)
    plt.savefig("DAG_healthcheck.png")
    plt.close()
    print("Graph saved as 'DAG_healthcheck.png' Red as unhealthy and Green as healthy nodes")


async def main():
    with open("input.json", "r") as f:
        dag = json.load(f)

    start_node = list(dag.keys())[0]  
    health_status = await traverse_system(dag, start_node)

 
    print("\nnodes health check:")
    for component, status in health_status.items():
        print(f"{component}: {status}")

   
    graph_representation(dag, health_status)


asyncio.run(main())

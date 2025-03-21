import asyncio
import json
import random
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64

# Simulated async health check function
async def check_component_health(component: str):
    """Simulates an async health check for a component."""
    await asyncio.sleep(random.uniform(0.5, 1.5))  # Simulated network delay
    return {"component": component, "status": random.choice(["Healthy", "Unhealthy"])}

# BFS Traversal with Async Health Checks
async def traverse_system(dag, start_node):
    """Traverse the system DAG using BFS asynchronously."""
    queue = asyncio.Queue()
    await queue.put(start_node)
    visited = set()
    health_results = {}

    while not queue.empty():
        tasks = []
        for _ in range(queue.qsize()):
            node = await queue.get()
            if node in visited:
                continue
            visited.add(node)
            tasks.append(check_component_health(node))

        results = await asyncio.gather(*tasks)
        for result in results:
            health_results[result["component"]] = result["status"]
            for neighbor in dag.get(result["component"], []):
                if neighbor not in visited:
                    await queue.put(neighbor)

    return health_results

# Graph visualization function
def visualize_graph(dag, health_results):
    """Generate and save a DAG image with failed components highlighted."""
    G = nx.DiGraph(dag)
    pos = nx.spring_layout(G)
    plt.figure(figsize=(8, 6))

    # Color nodes: Red for unhealthy, Green for healthy
    node_colors = ["red" if health_results[node] == "Unhealthy" else "green" for node in G.nodes]

    nx.draw(G, pos, with_labels=True, node_color=node_colors, edge_color="gray", node_size=2000, font_size=10)

    # Save image to file
    plt.savefig("system_health.png")
    plt.close()
    print("Graph saved as 'system_health.png'")

# Main function to load JSON and run BFS health check
async def main():
    """Load JSON file, process DAG, and visualize health status."""
    with open("input.json", "r") as f:
        dag = json.load(f)

    start_node = list(dag.keys())[0]  # Assume first key as start node
    health_results = await traverse_system(dag, start_node)

    # Display health status
    print("\nSystem Health Status:")
    for component, status in health_results.items():
        print(f"{component}: {status}")

    # Generate visualization
    visualize_graph(dag, health_results)

# Run the script
asyncio.run(main())

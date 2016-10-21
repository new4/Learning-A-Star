小顶堆：
实例方法：
- push：插入新元素
- pop：弹出堆顶元素
- remove：移除堆中某一元素
- get：获取堆中下标为 index 的值
- top：获取堆顶元素的值
- isEmpty：判断堆是否为空堆

算法 A*：
1. 生成一个只包含开始节点 n0 的搜索图 G，把 n0 放在一个叫 OPEN 的列表上。
2. 生成一个列表 CLOSED，它的初始值为空。
3. 如果 OPEN 为空，则失败退出。
4. 选择 OPEN 上的第一个节点，把它从 OPEN 中移入 CLOSED，称该节点为 n。
5. 如果 n 是目标节点，顺着 G 中，从 n 到 n0 的指针找到一条路径，获得解决方案，成功退出（该指针定义了一个搜索树，在第7步建立）。
6. 扩展节点 n，生成其后继节点集 M，在 G 中，n 的祖先不能在 M 中。在 G 中安置 M 的成员，使它们成为 n 的后继。
7. 从 M 的每一个不在 G 中的成员建立一个指向 n 的指针（例如，既不在 OPEN 中，也不在 CLOSED 中）。把 M 的这些成员加到 OPEN 中。对的每一个已在 OPEN 中或 CLOSED 中的成员 m，如果到目前为止找到的到达 m 的最好路径通过 n，就把它的指针指向 n。对已在 CLOSE 中的 M 的每一个成员，重定向它在 G 中的每一个后继，以使它们顺着到目前为止发现的最好路径指向它们的祖先。
8. 按递增值，重排 OPEN（相同最小值可根据搜索树中的最深节点来解决）。
9. 返回第 3 步。

伪代码：
```javascript
function A*(start, goal)
    // The set of nodes already evaluated.
    closedSet := {}
    // The set of currently discovered nodes still to be evaluated.
    // Initially, only the start node is known.

    openSet := {start}
    // For each node, which node it can most efficiently be reached from.
    // If a node can be reached from many nodes, cameFrom will eventually contain the
    // most efficient previous step.
    cameFrom := the empty map

    // For each node, the cost of getting from the start node to that node.
    gScore := map with default value of Infinity
    // The cost of going from start to start is zero.
    gScore[start] := 0
    // For each node, the total cost of getting from the start node to the goal
    // by passing by that node. That value is partly known, partly heuristic.
    fScore := map with default value of Infinity
    // For the first node, that value is completely heuristic.
    fScore[start] := heuristic_cost_estimate(start, goal)

    while openSet is not empty
        current := the node in openSet having the lowest fScore[] value
        if current = goal
            return reconstruct_path(cameFrom, current)

        openSet.Remove(current)
        closedSet.Add(current)
        for each neighbor of current
            if neighbor in closedSet
                continue		// Ignore the neighbor which is already evaluated.
            // The distance from start to a neighbor
            tentative_gScore := gScore[current] + dist_between(current, neighbor)
            if neighbor not in openSet	// Discover a new node
                openSet.Add(neighbor)
            else if tentative_gScore >= gScore[neighbor]
                continue		// This is not a better path.

            // This path is the best until now. Record it!
            cameFrom[neighbor] := current
            gScore[neighbor] := tentative_gScore
            fScore[neighbor] := gScore[neighbor] + heuristic_cost_estimate(neighbor, goal)

    return failure

function reconstruct_path(cameFrom, current)
    total_path := [current]
    while current in cameFrom.Keys:
        current := cameFrom[current]
        total_path.append(current)
    return total_path
```

# 常用方法
## data() 和 datum()
datum 将变量都赋值给前者
data 将变量分别赋值给前者，变量数小于标签数会undefined，元素数小于变量时会不现实（和enter不一样）

## append() 和 insert()
append将变量插入到选择集的末尾
insert将变量插入到选择元素的前面

## remove()
删除，无变量

## enter() 和 exit()
enter():将变量插入到指定位置，不会覆盖之前的元素的值。并且当元素个数小于数组时，会自动补齐元素（和data不一样）
exit():给指定的元素赋值，会覆盖元素的值 

# SVG 
attr(name, value):
value 可以是一个function

## domain() 和 range()
domain():定义域
``
d3.domain([d3.min(data),d3.max(data)])
``
range():值域

## 坐标轴scaleLinear():
``
.scaleLinear().domain([d3.min(data),d3.max(data)])
var x = d3.axisBottom().scale(VAR)
var y = d3.axisLeft().scale(VAR)

svg.append("g").call(x)
``
要在后面调用这个定义好的坐标轴

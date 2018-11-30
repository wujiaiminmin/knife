layui.use(["element", "laypage"], () => {
  let element = layui.element
  let laypage = layui.laypage
  const $ = layui.$
  
  element.tabDelete('demo', 'xxx')
 


  laypage.render({
    elem: "laypage",
    count: $("#laypage").data("maxnum"),
    limit: 5, // 每页显示5条数据，每一次查询5条数据
    groups: 3,
    curr: location.pathname.replace("/page/", ""),
    jump(obj, f){
      $("#laypage a").each((i, v) => {
        let pageValue = `/page/${$(v).data("page")}`
        v.href = pageValue
      })
    }
  })
})

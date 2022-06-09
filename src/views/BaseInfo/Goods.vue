<template>
  <div class="wrapper">
    <div class="tree">
      <div class="treeHeader">
        <el-input placeholder="搜索分类" v-model="filterText" prefix-icon="el-icon-search"></el-input>
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showAddDialog"></el-button>

        <el-dialog :title="goodsCateDialogTitle" :visible.sync="visible">
          <el-form>
            <el-form-item label="当前" label-width="60px">
              [{{selectNode.name}}]
            </el-form-item>
            <el-form-item label="级别" label-width="60px" v-show="!goodsCateForm.id">
              <el-radio v-model="grade" label="1">添加同级</el-radio>
              <el-radio v-model="grade" label="2">添加下级</el-radio>
            </el-form-item>
            <el-form-item label="商品分类" label-width="70px">
              <el-input placeholder="输入商品分类名称" v-model="goodsCateForm.name"></el-input>
            </el-form-item>
            <el-button type="primary" @click="saveGoodsCate">确定</el-button>
            <el-button @click="visible=false">取消</el-button>
          </el-form>
        </el-dialog>

      </div>
      <div>
        <el-tree :data="goodsCate" :props="defaultProps" node-key="id" ref="deptTree"
                 @node-click="handleNodeClick" :filter-node-method="filterNode" default-expand-all>
          <span class="custom-tree-node" slot-scope="{ node,data}">
            <span>{{ node.label }}</span>
            <span class="tree_node_btn">
              <el-button type="text" size="mini" icon="el-icon-edit" @click="showEditDialog(data)"></el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click="delGoodsCate(data)"></el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="table">
      <div class="tableHeader">
        <el-input placeholder="请输入关键字查询商品信息" v-model="keywords" style="width: 330px;margin-bottom: 8px;"></el-input>
      </div>
      <div class="tableContainer">
        <el-button type="primary" icon="el-icon-plus" @click="showAddGoods" style="margin-bottom: 5px;">新建商品信息</el-button>

        <el-table stripe :data="goods.filter(data => !keywords || data.name.toLowerCase().includes(keywords.toLowerCase()))" border>
          <el-table-column label="序号" width="50" type="index"></el-table-column>
          <el-table-column label="商品名" prop="name" width="80"></el-table-column>
          <el-table-column label="品牌" prop="brand_name" width="80"></el-table-column>
          <el-table-column label="S/N" prop="sn" width="80"></el-table-column>
          <el-table-column label="规格" prop="specs" width="100"></el-table-column>
          <el-table-column label="单位" prop="unit_name" width="100"></el-table-column>
          <el-table-column label="进货价" prop="purchase_price"  width="80"></el-table-column>
          <el-table-column label="销售价" prop="sale_price"  width="80"></el-table-column>
          <el-table-column label="是否上架" prop="on_sale" width="90">
            <template slot-scope="scope">
              <el-tag v-show="scope.row.on_sale">上架</el-tag>
              <el-tag type="danger" v-show="!scope.row.on_sale">下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditGoods(row)">修改</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="delGoods(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="新建商品" :visible.sync="goodsVisible">
      <el-form  v-model="goodForm">
        <el-form-item label="商品分类" label-width="70px">
          <el-cascader
              placeholder="试试搜索：分类"
              :options="goodsCate"
              v-model="goodForm.category_id"
              :props="defaultProps"
              filterable></el-cascader>
        </el-form-item>
        <el-form-item label="商品名" label-width="70px">
          <el-input placeholder="请输入商品名称" v-model="goodForm.name"></el-input>
        </el-form-item>
        <el-form-item label="S/N" label-width="70px">
          <el-input placeholder="请输入商品条形码或编号" v-model="goodForm.sn"></el-input>
        </el-form-item>

        <el-form-item label="品牌" label-width="70px">
          <el-select v-model="goodForm.brand_id" placeholder="请选择">
            <el-option v-for="item in brands" :key="item.id" :label="item.brand_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="规格" label-width="70px">
          <el-input placeholder="请输入商品的规格" v-model="goodForm.specs"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" label-width="70px">
          <el-select v-model="goodForm.unit" placeholder="请选择">
            <el-option v-for="(item,index) in units" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        <!--下一小段是包装信息操作-->
          <el-popover
              placement="right"
              width="400"
              trigger="click">
            <el-button type="primary" size="mini" @click="handleNewGoodUnit">增加新包装单位</el-button>
            <el-table :data="units">
              <el-table-column width="50" type="index" label="序号"></el-table-column>
              <el-table-column width="160" property="name" label="单位">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.edit" v-model="scope.row.name" placeholder="包装名"></el-input>
                  <span v-show="!scope.row.edit">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column width="width" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" v-show="scope.row.edit" @click="saveGoodUnit(scope.row)">保存</el-button>
                  <el-button type="danger" v-show="scope.row.edit" @click="cancleGoodUnit(scope.row)">取消</el-button>
                  <el-button type="primary" v-show="!scope.row.edit" @click="editGoodUnit(scope.row)">编辑</el-button>
                  <el-button type="danger" v-show="!scope.row.edit" @click="deleteGoodUnit(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button slot="reference">...</el-button>
          </el-popover>

        </el-form-item>
        <el-form-item label="进货价" label-width="70px">
          <el-input placeholder="请输入商品的进货价格" type="number" v-model="goodForm.purchase_price"></el-input>
        </el-form-item>
        <el-form-item label="销售价" label-width="70px">
          <el-input placeholder="请输入商品的销售价格" type="number" v-model="goodForm.sale_price"></el-input>
        </el-form-item>
        <el-form-item >
          <el-switch v-model="goodForm.on_sale" active-text="上架" inactive-text="下架"></el-switch>
        </el-form-item>
        <el-button type="primary" @click="saveGoods">保存数据</el-button>
        <el-button  @click="goodsVisible=false">取消</el-button>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>


export default {
  name: "Goods",

  data() {
    return {
      units:[],
      brands:[],
      goodForm:{
        on_sale:1,
      },
      //收集修改的信息
      goodsVisible:false,
      //部门树形控件
      goodsCate: [],

      defaultProps: {
        value:'id',   //要加这个cascade才可以使用
        label: 'name',
        emitPath:false
      },
      filterText:'',  //过滤文字
      //table数据
      goods:[],
      keywords:'',

      //分类试用
      selectNode: {},
      goodsCateDialogTitle:'',
      visible:false,
      grade:'1', //1同级，2下级
      goodsCateForm:{
        name:'',
        p_id:null,
      },
      ids:[],
      cateId:undefined,
    };
  },
  mounted() {
    this.initGoodsCate();
    this.getGoodsByCateId();
    this.initGoodUnit();
    this.initBrands();
  },
  watch: {
    filterText(val) {  //监视变化进行过滤
      this.$refs.depTree.filter(val);
    }
  },
  methods: {
    initBrands(){
      this.getRequest('/admin/brands/all').then(resp=>{
        this.brands = resp.data;
      })
    },
    saveGoodUnit(row){
      const url = row.id?'/admin/goodunit/upd':'/admin/goodunit/add';
      delete row.edit;
      this.postRequest(url,row).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initGoodUnit();
        }
      })
    },
    deleteGoodUnit(row){
      this.$confirm('此操作将永久删除['+row.name+'] 包装单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/admin/goodunit/del/'+row.id).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initGoodUnit();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editGoodUnit(row){
      this.$set(row,"edit",true);
    },
    cancleGoodUnit(row){
      if(row.id){
        this.initGoodUnit();
      }else{
        this.units.shift();
      }
    },
    handleNewGoodUnit(){
      this.units.unshift({edit:true});
    },
    handleNodeClick(data){
      this.cateId = data.id;
      this.getGoodsByCateId();
    },
    //todo:获得分类下的职员列表,参数是选中的节点数组
    getGoodsByCateId(){
      this.getRequest(`/admin/goods/${this.cateId}`).then(resp=>{
        if(resp){
          this.goods = resp.data;
          this.goods.forEach(item=>{
            item.on_sale = item.on_sale === 1;
          })
        }else{
          this.goods=[];
        }
      })
    },
    saveGoods(){
      if(this.goodForm.id){//edit
        delete this.goodForm.unit_name;
        delete this.goodForm.brand_name;
        this.postRequest('/admin/goods/upd',this.goodForm).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.getGoodsByCateId();
          }
        })

      }else{
        this.postRequest('/admin/goods/add',this.goodForm).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.getGoodsByCateId();
          }
        })
      }
      this.goodsVisible = false;
    },
    showEditGoods(data){
      this.goodForm = {...data};
      this.goodsVisible = true;
    },
    //删除商品分类
    delGoodsCate(data){
      this.$confirm('此操作将永久删除['+data.name+'] 分类信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/admin/goodscate/del/'+data.id).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initGoodsCate();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //显示编辑分类弹窗
    showEditDialog(data){
      this.goodsCateForm = {...data};
      this.goodsCateDialogTitle='编辑商品分类信息';
      this.visible = true;
    },
    //保存分类信息或编辑分类信息
    saveGoodsCate(){
      if(this.goodsCateForm.id){//edit
        this.postRequest('/admin/goodscate/upd',this.goodsCateForm).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initGoodsCate();
          }
        })
      }
      else{
        if(this.grade === '1')
          this.goodsCateForm.p_id = this.selectNode.p_id;
        if(this.grade === '2')
          this.goodsCateForm.p_id = this.selectNode.id;
        this.postRequest('/admin/goodscate/add',this.goodsCateForm).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initGoodsCate();
          }
        })
      }
      this.visible = false;
    },
    //显示增加弹窗
    showAddDialog(){
      this.goodsCateForm={};
      this.goodsCateDialogTitle = '添加新的商品分类';
      this.visible = true;

    },
    initGoodUnit(){
      this.getRequest('/admin/goodunit').then(resp=>{
        if(resp){
          this.units = resp.data;
        }
      })
    },
    //获取所有部门的tree数据
    initGoodsCate(){
      this.getRequest('/admin/goodscate').then(resp=>{
        if(resp){
          this.goodsCate = resp.data;
        }
      })
    },

    //tree过滤函数
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    showAddGoods(){
      this.goodForm = {on_sale: true};
      this.goodsVisible = true;

    },

    delGoods(row){
      this.deleteRequest(`/admin/goods/delete/${row.id}`).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.getGoodsByCateId();
        }
      })
    },

  }
}
</script>

<style scoped  lang="scss">
.wrapper{
  display: flex;
  align-items: stretch;
  position: absolute;
  width: 100%;
  height: 100%;
  .tree{
    width: 210px;
    .treeHeader{
      margin: 5px;
      display: flex;
      .el-button{
        margin-left: 7px;
      }
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .tree_node_btn{
        visibility: hidden;
      }
      &:hover{
        .tree_node_btn{
          visibility: visible;
        }
      }
    }
  }
  .table{
    border-left:1px solid #dce4ec;
    flex-grow: 1;
    .tableHeader{
      margin:5px 5px 0 5px;
      border-bottom: 1px solid #dce4ec
    }
    .tableContainer{
      margin:5px;
    }
  }


}
</style>


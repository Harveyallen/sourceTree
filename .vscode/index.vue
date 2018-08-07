<template>
  <el-table-column
  :label="label"
  :width="width">
    <template slot-scope="scope">
      <slot v-if="scope.row.$_edit" :row="scope.row">
        <el-input size="mini" v-model="scope.row.prop"></el-input>
        <el-form :model="scope.row" :rules="formValidator" ref="scope.row" >
          <el-form-item prop="prop">
             <el-input size="mini" v-model="scope.row.prop"></el-input>
          </el-form-item>
        </el-form>
      </slot>
      <slot name="props" v-else :row="scope.row">
        <span>{{ scope.row[prop] }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script>
import { noChinese } from '@/lib/validateForm';

export default {
  props: {
    prop: [String],
    label: [String],
    width: [String],
  },
  computed: {
    formValidator() {
      const validatorNoChinese = (rule, value, callback) => {
        if ((this.prop === 'name_en') && (!noChinese(value))) {
          return callback(Error(this.$t('InputValueExludingCN')));
        }
        return callback();
      };
      return {
        prop: [
          { validator: validatorNoChinese, trigger: 'change' },
        ],
      };
    },
  },
};
</script>

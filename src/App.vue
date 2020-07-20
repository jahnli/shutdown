<template>
  <div id="app">
    <a-row class="area" type="flex" justify="space-between">
      <a-col >
        <span class="label">模式：</span>
        <a-select v-model="type"  class="input-area">
          <a-select-option value="time">倒计时</a-select-option>
          <a-select-option value="assign">指定时间</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <span class="label">动作：</span>
        <a-select v-model="action"  class="input-area" >
          <a-select-option value="s">关机</a-select-option>
          <a-select-option value="r">重启</a-select-option>
          <a-select-option value="l">注销</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="area" type="flex" justify="space-between">
      <a-col v-if="type == 'time'">
        <span class="label">时：</span>
        <a-input-number class="input-area"v-model="hour" :min="1"  />
      </a-col>
      <a-col v-if="type == 'time'">
        <span class="label">分：</span>
        <a-input-number  class="input-area"  v-model="minute" :min="1" />
      </a-col>
      <a-date-picker
              v-if="type == 'assign'"
              v-model="time"
              inputReadOnly
              :disabled-date="disabledDate"
              show-time placeholder="选择日期时间"
              valueFormat="X"
      />
    </a-row>
    <a-row v-if="timer">
      <a-statistic-countdown
              title="倒计时"
              :value="count"
      />
    </a-row>
    <div class="btn">
      <a-button v-if="timer"  type="dashed" @click="cancel">取消任务</a-button>
      <a-button class="handle-area" :disabled="timer !== null" type="primary" @click="handle">立即执行</a-button>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import Timer from 'timer.js';
  const child_process = window.require('child_process');
  export default {
    name: 'App',
    data() {
      return {
        type:'time',
        action:'s',
        hour:'',
        minute:'',
        timer:null,
        time:''
      }
    },
    created() {
      this.$electron.ipcRenderer.on('chackStatus',()=>{
        if(this.timer){
          this.$confirm({
            title: '确定退出程序 ？',
            content: '任务进行中，退出任务将被取消！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=> {
              this.$electron.ipcRenderer.send('handle','quit')
            },
            onCancel() {

            },
          });
        }else{
          this.$electron.ipcRenderer.send('handle','quit')
        }
      })
    },
    methods:{
      check(){
        let isOk = true;
        if(this.type == 'time'){
          if(!this.hour && !this.minute){
            isOk = false;
            this.$message.error('请填写时间或分钟');
          }
          if(this.hour >= 24){
            isOk = false;
            this.$message.error('超过24小时，请使用指定时间模式');
          }
        }
        return isOk;
      },
      disabledDate(current) {
        return current && current < moment().startOf('hour');
      },
      handle(){
        if(this.check()){
          if(!this.timer){
            this.timer = new Timer();
            let time = 0;
            if(this.type == 'time'){
              if(this.minute){
                time = time + this.minute * 60
              }
              if(this.hour){
                time = time + this.hour * 60 * 60
              }
            }else{
              let currentTime = moment().format('X');
              time = this.time - currentTime;
            }
            if(this.action !== 'l'){
              this.$electron.ipcRenderer.send('start',this.action,time);
            }
            this.timer.start(time).on('end',() => {
              this.$message.info('结束');
              this.timer = null;
              if(this.action == 'l'){
                child_process.exec(`shutdown -l`,(err,stdout, stderr)=>{})
              }
            });
          }
        }
      },
      timeHandle(){

      },
      cancel(){
        this.$electron.ipcRenderer.send('cancel');
        this.timer.stop();
        this.timer = null;
        [this.hour,this.minute] = ['']
      }
    },
    computed:{
      count(){
        let time;
        if(this.type == 'time'){
          time = Date.now();
          if(this.minute){
            time = time + this.minute * 60 * 1000
          }
          if(this.hour){
            time = time + this.hour * 60 * 60 * 1000
          }
        }else{
          return  this.time * 1000;
        }
        return time
      }
    },
    components: {}
  }
</script>

<style lang="less">
  #app{
    width:80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0 auto;
    padding: 30px 0;
  }
  .input-area{
    min-width: 120px;
  }
  .handle-area{
    margin-left: 20px;
  }
  .label{
    display: inline-block;
    min-width: 60px;
    text-align:left;
  }
  .btn{
    text-align: right;
  }
</style>

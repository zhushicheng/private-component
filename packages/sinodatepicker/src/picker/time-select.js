import Picker from '../picker.vue';
import Panel from '../panel/time-select.vue';

export default {
  mixins: [Picker],

  name: 'sinoTimeSelect',

  beforeCreate() {
    this.type = 'sinotimeselect';
    this.panel = Panel;
  }
};

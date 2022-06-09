import store from "@/store";

const {body} = document;
const WIDTH=992;

export default {
    beforeMount() {
        window.addEventListener('resize',this.$_resizeHandler)
    },
    beforeDestroy() {
        window.removeEventListener('resize',this.$_resizeHandler);
        },
    mounted() {
        this.$_resizeHandler();
    },
    methods:{
        $_isMobile(){
            const rect = body.getBoundingClientRect();
            return rect.width-1<WIDTH;
        },
        $_resizeHandler(){
            if(!document.hidden){
                const isMobile = this.$_isMobile();
                store.commit('app/TOGGLE_DEVICE',isMobile?'mobile':'desktop');
                if(isMobile){
                    store.commit('app/CLOSE_SIDEBAR');
                }
            }
        }
    }
}

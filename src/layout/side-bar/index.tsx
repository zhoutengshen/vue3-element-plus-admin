import type { MenusRouteRecord } from '@/stores/modules/app/types'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { defineComponent, computed } from 'vue'
// @ts-ignore
import { join } from 'path'
import 'element-plus/es/components/menu/style/index'
import 'element-plus/es/components/menu-item/style/index'
import 'element-plus/es/components/sub-menu/style/index'
import './index.scss'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'LayoutSideBar',
  props: {
    menus: {
      type: Array<MenusRouteRecord>,
      require: true,
    },
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const menus = computed(() => props.menus || [])
    const router = useRouter()
    const route = useRoute()
    const activeIndex = route.path
    const renderElSubMenus = (subMenus: MenusRouteRecord, fatherPath = '') => {
      if (!subMenus) {
        return null
      }
      const { children, meta, path } = subMenus
      const fullPath = join(fatherPath, path)

      const handleNav = () => {
        router.push(fullPath)
      }
      if (!children) {
        if (meta && meta.title) {
          return (
            <ElMenuItem index={fullPath} onClick={handleNav}>
              {meta.title}
            </ElMenuItem>
          )
        } else {
          return null
        }
      }

      const slots = {
        title: () =>
          meta?.title ? (
            <div
              class={{
                'style.is-active-path': route.path.includes(fullPath),
              }}>
              {meta?.title}
            </div>
          ) : null,
        default: () => children.map((item) => renderElSubMenus(item, fullPath)),
      }
      return <ElSubMenu index={fullPath}>{slots}</ElSubMenu>
    }

    return () => (
      <ElMenu class="side-bar-menu" collapse={props.collapse} uniqueOpened={false} defaultActive={activeIndex}>
        {menus.value.map((item) => renderElSubMenus(item))}
      </ElMenu>
    )
  },
})

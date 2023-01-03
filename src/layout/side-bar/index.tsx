import type { MenusRouteRecord } from '@/stores/modules/app/types'
import { ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { defineComponent, computed, type Component } from 'vue'
import 'element-plus/es/components/menu/style/index'
import 'element-plus/es/components/menu-item/style/index'
import 'element-plus/es/components/sub-menu/style/index'
import './index.scss'
import { useRoute, useRouter } from 'vue-router'
import { isVueComponent } from '@/utils/is'
import { useAppStore } from '@/stores'
export default defineComponent({
  name: 'LayoutSideBar',
  setup() {
    const appStore = useAppStore()
    const menus = computed(() => appStore.clientMenus || [])
    const router = useRouter()
    const route = useRoute()
    const activeIndex = computed(() => route.path)
    const renderElSubMenus = (subMenus: MenusRouteRecord) => {
      if (!subMenus) {
        return null
      }
      const { children, meta, fullPath } = subMenus
      if (!fullPath) {
        return null
      }
      const handleNav = async () => {
        await router.push(fullPath)
        appStore.addOpenedPage({
          path: fullPath,
          icon: meta?.icon,
          label: meta?.title,
        })
      }

      const renderTitleSlot = (title?: string, IconCmp?: Component) => {
        if (!title) {
          return null
        }
        const clazz = {
          'is-active-path': route.path.includes(fullPath),
        }
        const renderTitleIcon = () =>
          isVueComponent(IconCmp) ? (
            <ElIcon class={clazz}>
              <IconCmp />
            </ElIcon>
          ) : null
        return (
          <>
            {renderTitleIcon()}
            <span class={clazz}>{title}</span>
          </>
        )
      }

      if (!children) {
        if (meta && meta.title) {
          const slots = {
            title: () => renderTitleSlot(meta?.title, meta?.icon),
          }
          return (
            <ElMenuItem index={fullPath} onClick={handleNav}>
              {slots}
            </ElMenuItem>
          )
        } else {
          return null
        }
      }

      const slots = {
        title: () => renderTitleSlot(meta?.title, meta?.icon),
        default: () => children.map((item) => renderElSubMenus(item)),
      }

      return <ElSubMenu index={fullPath}>{slots}</ElSubMenu>
    }

    return () => (
      <ElMenu
        class="side-bar-menu"
        collapse={appStore.collapseSideMenus}
        uniqueOpened={false}
        defaultActive={activeIndex.value}>
        {menus.value.map((item) => renderElSubMenus(item))}
      </ElMenu>
    )
  },
})

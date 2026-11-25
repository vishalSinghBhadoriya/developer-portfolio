export const projectSlugs = {
  habitat: 'habitat',
  velocity: 'velocity',
  reboot: 'reboot',
  buyNest: 'buynest',
  taskSphere: 'tasksphere',
  bocaEnBoca: 'boca-en-boca',
}

export const playgroundPath = '/playground'
export const workPath = slug => '/work/' + slug
export const staticRoutes = [playgroundPath, ...Object.values(projectSlugs).map(workPath)]

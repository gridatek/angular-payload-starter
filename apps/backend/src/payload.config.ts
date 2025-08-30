// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: ['http://localhost:4200'],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Categories, Posts, Media],

  globals: [
    {
      slug: 'settings',
      admin: {
        group: 'Configuration',
      },
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'General',
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  required: true,
                  defaultValue: 'My Blog',
                },
                {
                  name: 'siteDescription',
                  type: 'textarea',
                  admin: {
                    description: 'This will be used for SEO meta descriptions',
                  },
                },
                {
                  name: 'siteUrl',
                  type: 'text',
                  admin: {
                    description: 'Your site URL (used for sitemaps and SEO)',
                  },
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              label: 'Social',
              fields: [
                {
                  name: 'social',
                  type: 'group',
                  fields: [
                    {
                      name: 'twitter',
                      type: 'text',
                    },
                    {
                      name: 'facebook',
                      type: 'text',
                    },
                    {
                      name: 'instagram',
                      type: 'text',
                    },
                    {
                      name: 'linkedin',
                      type: 'text',
                    },
                    {
                      name: 'youtube',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
            {
              label: 'SEO',
              fields: [
                {
                  name: 'seo',
                  type: 'group',
                  fields: [
                    {
                      name: 'defaultTitle',
                      type: 'text',
                      admin: {
                        description: 'Default title suffix for all pages',
                      },
                    },
                    {
                      name: 'defaultDescription',
                      type: 'textarea',
                      admin: {
                        description: 'Default meta description',
                      },
                    },
                    {
                      name: 'defaultImage',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        description: 'Default social sharing image',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      access: {
        read: () => true,
        update: ({ req: { user } }) => Boolean(user),
      },
    },
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
      // outputFile: path.resolve(dirname, 'payload-types.ts'),
      outputFile: '../../packages/types/payload-types.ts',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})

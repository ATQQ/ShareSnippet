export interface Prop {
	key: string
	value: string
	description: string
	required: boolean // 是否必要的属性
	bind: boolean // 是否以 :param=”xx” 的形式展示
	hide_value: boolean // 是否展示值选择列表
}
export interface CodeSnippet {
	scope: string, // 支持的语言列表
	prefix: string, // 前缀
	body: string | string[], // 片段内容
	description: string // 片段描述
	type: snippetType
}

export interface TagComponent extends CodeSnippet {
	name: string // 组件名称
	props: Prop[] // 参数
	self_closing: boolean // 自闭和
	language: componentType
}

export interface TemplateConfig extends CodeSnippet {
	name: string // 模板名称即prefix
	/**
	 * 模板文件的相对路径
	 */
	path: string
}
export type snippetType = 'template' | 'component';
export type componentType = 'tag' | 'vue' | 'react';
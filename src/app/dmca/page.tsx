import React from 'react'

export default function DMCA() {
    return (
        <div>
            <h2 className='mb-4 text-2xl underline'>DMCA</h2>
            <p>
                Avertissement légal
                <br />
                Les propriétaires et opérateurs de {process.env.Site_URL} ne sont pas les producteurs du contenu visuel présent sur le site.
                <br /><br />
                {process.env.Site_URL} n&apos;héberge aucun contenu directement.
                <br /><br />
                Le site utilise des liens ou des intégrations de contenu hébergé sur des plateformes de streaming tierces. En cliquant sur les liens vidéo sur {process.env.Site_URL}, vous visionnez du contenu hébergé par des tiers et {process.env.Site_URL} ne peut être tenu responsable du contenu hébergé sur d&apos;autres sites.
                <br /><br />
                Nous ne téléchargeons aucune vidéo et ne contrôlons pas l&apos;origine des contenus. Les liens vers les vidéos sont soumis et gérés par les utilisateurs.
                <br /><br />
                Pour toute question ou problème, veuillez contacter : contact@animestream.dev
                <br /><br />
                Les titulaires de droits d&apos;auteur doivent contacter directement l&apos;hébergeur vidéo ou le fournisseur de contenu concerné.
                <br /><br />
                – Toutes les marques et logos mentionnés sont des marques déposées de leurs propriétaires respectifs.
                <br /><br />
                Avis de violation du droit d&apos;auteur (DMCA)
                <br /><br />
                AnimeStream est un fournisseur de services en ligne au sens du Digital Millennium Copyright Act.
                <br /><br />
                Nous accordons une grande importance au respect des droits d&apos;auteur et protégeons activement les droits des titulaires légitimes.
                <br />
                Si vous êtes titulaire des droits d&apos;auteur sur du contenu apparaissant sur le site AnimeStream et que vous n&apos;avez pas autorisé son utilisation, veuillez nous en informer par écrit afin que nous puissions identifier le contenu présumé contrefaisant et prendre les mesures nécessaires. Votre notification écrite doit inclure les éléments suivants :
                <br />
                – Identification précise de l&apos;œuvre protégée dont vous alléguez la violation.
                <br /><br />
                – Identification précise de l&apos;emplacement et description du matériel présumé contrefaisant, avec suffisamment de détails pour nous permettre de le localiser (URL complète).
                <br /><br />
                – Informations suffisantes pour nous contacter (nom, adresse, téléphone, e-mail).
                <br /><br />
                – Une déclaration de bonne foi indiquant que l&apos;utilisation du matériel n&apos;est pas autorisée par le titulaire des droits, son agent ou la loi. – Une déclaration attestant que les informations de la notification sont exactes, et sous peine de parjure, que vous êtes autorisé à agir au nom du titulaire des droits exclusifs présumément violés.</p>
        </div>
    )
}
